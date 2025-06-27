import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '@core/models/product.model';
import { HeaderComponent } from '@features/admin/shared/header/header.component';
import { SidebarComponent } from '@features/admin/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-product',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
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
    // Aquí iría la lógica para abrir un modal de edición o navegar a la ruta de edición.
    // Ejemplo: this._router.navigate(['/products', product.id, 'edit']);
  }

  /**
   * Maneja la eliminación de un producto.
   * IMPORTANTE: En una aplicación real, se usaría un modal de confirmación personalizado
   * en lugar de 'confirm()' para una mejor experiencia de usuario.
   * @param product El producto a eliminar.
   */
  deleteProduct(product: Product): void {
    console.log('Intento de eliminar producto:', product.name);
    // Simulación de confirmación para evitar el bloqueo de 'confirm()'
    // En un entorno de producción, aquí invocarías un modal de confirmación.
    const confirmed = true; // Por ahora, asumimos que siempre se confirma para la demostración

    if (confirmed) {
      this._productService.deleteProduct(product.id)
        .then(() => {
          console.log('Producto eliminado con éxito:', product.name);
          // Esto es importante para que la UI se actualice después de la eliminación.
          this.products$ = this._productService.getProducts();
        })
        .catch((err) => {
          console.error('Error al eliminar el producto:', err);
          // Aquí podrías mostrar un mensaje de error al usuario, por ejemplo, con un Toastr o un modal de error.
        });
    } else {
      console.log('Eliminación cancelada para el producto:', product.name);
    }
  }

  /**
   * Maneja la creación de un nuevo producto.
   * En una aplicación real, esto podría abrir un modal o navegar a un formulario de creación.
   */
  newProduct(): void {
    console.log('Funcionalidad para crear un nuevo producto.');
    // Aquí iría la lógica para abrir un modal de creación o navegar a la ruta de creación.
    // Ejemplo: this._router.navigate(['/products/new']);
  }
}
