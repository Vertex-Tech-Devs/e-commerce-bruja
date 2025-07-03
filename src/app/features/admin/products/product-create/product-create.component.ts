import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';

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

  public productForm!: FormGroup;
  public isSubmitting = false;

  ngOnInit(): void {
    this.productForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get category() { return this.productForm.get('category'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Deshabilita el botón para evitar doble envío
    const newProduct = this.productForm.value;

    this._productService.createProduct(newProduct)
      .then(() => {
        console.log('Producto creado exitosamente!');
        this._router.navigate(['/admin/products']);
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
        this.isSubmitting = false; // Vuelve a habilitar el botón si hay un error
      });
  }

  onCancel(): void {
    this._router.navigate(['/admin/products']);
  }
}
