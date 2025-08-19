import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Product, ProductVariant } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _productService = inject(ProductService);
  private _cartService = inject(CartService);

  public product$: Observable<Product | undefined>;
  public product: Product | undefined;
  public quantity: number = 1;

  public mainImage: string = '';
  public galleryImages: string[] = [];

  public uniqueSizes: string[] = [];
  public availableColorsForSelectedSize: string[] = [];
  public selectedVariant: ProductVariant | null = null;
  public selectedSize: string | null = null;
  public selectedColor: string | null = null;

  constructor() {
    this.product$ = this._route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        if (productId) {
          return this._productService.getProductById(productId);
        }
        return of(undefined);
      })
    );
  }

  ngOnInit(): void {
    this.product$.subscribe(productData => {
      this.product = productData;
      if (this.product) {
        this.mainImage = this.product.image;
        this.galleryImages = [this.product.image, ...(this.product.images || [])];

        if (this.product.variants) {
          this.uniqueSizes = [...new Set(this.product.variants.map(v => v.size))].sort();
        }
      }
    });
  }

  selectSize(size: string): void {
    if (!this.product || !this.product.variants) return;

    this.selectedSize = size;
    this.availableColorsForSelectedSize = this.product.variants
      .filter(v => v.size === size)
      .map(v => v.color);

    this.selectedColor = null;
    this.selectedVariant = null;
    this.quantity = 1;
  }

  selectColor(color: string): void {
    if (!this.product || !this.product.variants) return;

    this.selectedColor = color;
    this.selectedVariant = this.product.variants.find(v =>
      v.size === this.selectedSize && v.color === color
    ) || null;
    this.quantity = 1;
  }

  changeMainImage(image: string): void {
    this.mainImage = image;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.selectedVariant && this.quantity < this.selectedVariant.stock) {
      this.quantity++;
    }
  }

  addToCart(): void {
    if (this.product && this.selectedVariant) {
      this._cartService.addItem(this.product, this.selectedVariant, this.quantity);
    }
  }
}
