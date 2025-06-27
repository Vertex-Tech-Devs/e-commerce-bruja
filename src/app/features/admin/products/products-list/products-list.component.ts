import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '@core/models/product.model';


@Component({
  selector: 'app-product',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [CommonModule, RouterModule,],
  standalone: true,
})
export class ProductsListComponent implements OnInit {

  public products$!: Observable<Product[]>;
  private _productService = inject(ProductService);

  ngOnInit(): void {
    this.products$ = this._productService.getProducts();
  }

  /**
   * Maneja la edición de un producto.
   * En una aplicación real, esto podría abrir un modal o navegar a un formulario de edición.
   * @param product El producto a editar.
   */
  editProduct(product: Product): void {
    console.log('Funcionalidad para editar producto:', product.name);
  }

  /**
   * Maneja la eliminación de un producto.
   * IMPORTANTE: En una aplicación real, se usaría un modal de confirmación personalizado
   * en lugar de 'confirm()' para una mejor experiencia de usuario.
   * @param product El producto a eliminar.
   */
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
    console.log('Funcionalidad para crear un nuevo producto.');
  }
}
