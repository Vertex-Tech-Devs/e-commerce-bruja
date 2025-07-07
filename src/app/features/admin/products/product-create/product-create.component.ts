import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/models/product.model';
import { take } from 'rxjs/operators';

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
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  public productForm!: FormGroup;
  public isSubmitting = false;
  public isEditMode = false;
  public productId: string | null = null;
  public pageTitle = 'Crear Nuevo Producto';
  public originalProductName: string = '';

  ngOnInit(): void {
    this.productForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });

    this.productId = this._route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Producto';
      this.loadProductForEdit(this.productId);
    }
  }

  private loadProductForEdit(id: string): void {
    this._productService.getProductById(id).pipe(
      take(1)
    ).subscribe({
      next: (product: Product) => {
        if (product) {
          this.originalProductName = product.name;
          this.pageTitle = `Editar: ${this.originalProductName}`;

          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image
          });
        } else {
          console.error('Producto no encontrado para editar:', id);
          this._router.navigate(['/admin/products']);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar el producto para edición:', error);
        this._router.navigate(['/admin/products']);
      }
    });
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get category() { return this.productForm.get('category'); }
  get image() { return this.productForm.get('image'); }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this._productService.updateProduct(this.productId, productData)
        .then(() => {
          console.log('Producto actualizado exitosamente!');
          this._router.navigate(['/admin/products/detail', this.productId]);
        })
        .catch((error) => {
          console.error('Error al actualizar el producto:', error);
          this.isSubmitting = false;
        });
    } else {
      this._productService.createProduct(productData)
        .then(() => {
          console.log('Producto creado exitosamente!');
          this._router.navigate(['/admin/products']);
        })
        .catch((error) => {
          console.error('Error al crear el producto:', error);
          this.isSubmitting = false;
        });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.productId) {
      this._router.navigate(['/admin/products/detail', this.productId]);
    } else {
      this._router.navigate(['/admin/products']);
    }
  }
}
