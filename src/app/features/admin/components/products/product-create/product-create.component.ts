import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { WithFieldValue } from '@angular/fire/firestore';

import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { Product, ProductVariant } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { SweetAlertService } from '@core/services/sweet-alert.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent implements OnInit {

  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  private _categoryService = inject(CategoryService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _sweetAlertService = inject(SweetAlertService);

  public productForm!: FormGroup;
  public categories$!: Observable<Category[]>;
  public isSubmitting = false;
  public isEditMode = false;
  public productId: string | null = null;
  public pageTitle = 'Crear Nuevo Producto';
  public originalProductName: string = '';

  ngOnInit(): void {
    this.categories$ = this._categoryService.getCategories();
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.productForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      images: this._fb.array([]),
      variants: this._fb.array([], Validators.required),
    });
  }

  private checkEditMode(): void {
    this.productId = this._route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Producto';
      this.loadProductForEdit(this.productId);
    }
  }

  private loadProductForEdit(id: string): void {
    this._productService.getProductById(id).pipe(take(1)).subscribe({
      next: (product: Product) => {
        if (product) {
          this.originalProductName = product.name;
          this.pageTitle = `Editar: ${this.originalProductName}`;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
          });

          this.variants.clear();
          this.images.clear();

          if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => this.addVariant(variant));
          }
          if (product.images && product.images.length > 0) {
            product.images.forEach(imageUrl => this.addImage(imageUrl));
          }
        } else {
          this._sweetAlertService.error('Error', 'Producto no encontrado para editar.');
          this._router.navigate(['/admin/products']);
        }
      },
      error: (error: any) => {
        this._sweetAlertService.error('Error', 'Hubo un problema al cargar el producto.');
        this._router.navigate(['/admin/products']);
      },
    });
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get category() { return this.productForm.get('category'); }
  get image() { return this.productForm.get('image'); }
  get variants(): FormArray { return this.productForm.get('variants') as FormArray; }
  get images(): FormArray { return this.productForm.get('images') as FormArray; }

  createVariantGroup(variant?: ProductVariant): FormGroup {
    return this._fb.group({
      size: [variant?.size || '', Validators.required],
      color: [variant?.color || '', Validators.required],
      stock: [variant?.stock || 0, [Validators.required, Validators.min(0)]],
    });
  }

  addVariant(variant?: ProductVariant): void {
    this.variants.push(this.createVariantGroup(variant));
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  addImage(imageUrl: string = ''): void {
    this.images.push(this._fb.control(imageUrl, [Validators.required, Validators.pattern('https?://.+')]));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this._sweetAlertService.error('Formulario Inválido', 'Por favor, revisa todos los campos, incluidas las variantes e imágenes.');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.productForm.value;

    const operation = this.isEditMode && this.productId
      ? this._productService.updateProduct(this.productId, formValue)
      : this._productService.createProduct({ ...formValue, createdAt: new Date() } as WithFieldValue<Product>);

    operation.then(() => {
      const successMessage = this.isEditMode ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.';
      this._sweetAlertService.success('¡Éxito!', successMessage);
      const redirectRoute = this.isEditMode ? ['/admin/products/detail', this.productId] : ['/admin/products'];
      this._router.navigate(redirectRoute);
    }).catch((error) => {
      const errorMessage = this.isEditMode ? 'No se pudo actualizar el producto.' : 'No se pudo crear el producto.';
      this._sweetAlertService.error('Error', errorMessage);
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.productId) {
      this._router.navigate(['/admin/products/detail', this.productId]);
    } else {
      this._router.navigate(['/admin/products']);
    }
  }
}
