import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '@core/models/product.model';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class ProductsListComponent implements OnInit {

  public products$!: Observable<Product[]>;
  private _productService = inject(ProductService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.products$ = this._productService.getProducts();
  }


  editProduct(product: Product): void {
    console.log('Funcionalidad para editar producto:', product.name);
  }


  deleteProduct(product: Product): void {
    console.log('Intento de eliminar producto:', product.name);
    const confirmed = true;

    if (confirmed) {
      this._productService.deleteProduct(product.id)
        .then(() => {
          console.log('Producto eliminado con éxito:', product.name);
          this.products$ = this._productService.getProducts();
        })
        .catch((err) => {
          console.error('Error al eliminar el producto:', err);
        });
    } else {
      console.log('Eliminación cancelada para el producto:', product.name);
    }
  }

  newProduct(): void {
    this._router.navigate(['/admin/products/create']);
  }
}
