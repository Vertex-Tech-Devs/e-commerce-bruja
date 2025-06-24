import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Añade RouterModule
import { CommonModule, CurrencyPipe } from '@angular/common'; // Necesario para ngIf, ngFor, y pipes
import { Product } from 'src/app/core/models/product.model'; // Ajusta la ruta a tu modelo
import { ProductService } from 'src/app/core/services/product.service'; // Asumiendo que tienes un ProductService
import { HeaderComponent } from '@features/admin/shared/header/header.component';
import { SidebarComponent } from '@features/admin/shared/sidebar/sidebar.component';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true, // ¡Importante! Marca este componente como standalone
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    CurrencyPipe
  ]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (data: Product) => {
          this.product = data;
        },
        error: (error) => {
          console.error('Error al cargar el producto:', error);
          // Puedes redirigir o mostrar un mensaje
          this.router.navigate(['/admin/products']);
        }
      });
    } else {
      console.error('ID de producto no proporcionado en la ruta.');
      this.router.navigate(['/admin/products']);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }

  editProduct(): void {
    if (this.productId) {
      this.router.navigate(['/admin/products/edit', this.productId]);
    }
  }

  deleteProduct(): void {
    if (this.productId && confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          console.log('Producto eliminado con éxito.');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      });
    }
  }
}
