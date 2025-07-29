import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { HeaderComponent } from '@features/admin/components/shared/components/header/header.component';
import { SidebarComponent } from '@features/admin/components/shared/components/sidebar/sidebar.component';
import { from, Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDeleteModalComponent } from '@features/admin/components/shared/components/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  productId: string | null = null;
  private productSubscription: Subscription | undefined;
  private _modalService = inject(BsModalService);
  // --- Referencia al modal abierto de NGX-BOOTSTRAP ---
  bsModalRef?: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.productSubscription = this.productService.getProductById(this.productId).subscribe({
        next: (data: Product) => {
          this.product = data;
        },
        error: (error) => {
          console.error('Error al cargar el producto:', error);
          this.router.navigate(['/admin/products']);
        }
      });
    } else {
      console.error('ID de producto no proporcionado en la ruta.');
      this.router.navigate(['/admin/products']);
    }
  }


  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    this.bsModalRef?.hide();
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }

  editProduct(): void {
    if (this.productId) {
      this.router.navigate(['/admin/products/edit', this.productId]);
    }
  }


  confirmDeleteProduct(): void {
    if (!this.product || !this.product.id) {
      console.warn('No hay producto o ID de producto para eliminar.');
      return;
    }

    this.bsModalRef = this._modalService.show(ConfirmDeleteModalComponent, {
      initialState: {
        title: 'Confirmar Eliminación de Producto',
        message: `¿Estás seguro de que deseas eliminar el producto "${this.product.name}"? Esta acción no se puede deshacer.`,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      },
      class: 'modal-md modal-dialog-centered',
      backdrop: 'static',
      keyboard: false
    });


    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        from(this.productService.deleteProduct(this.product!.id)).subscribe({
          next: () => {
            console.log('Producto eliminado con éxito.');
            this.router.navigate(['/admin/products']);
          },
          error: (error: any) => {
            console.error('Error al eliminar el producto:', error);
          }
        });
      } else {
        console.log('Eliminación cancelada para el producto:', this.product?.name);
      }
      this.bsModalRef = undefined;
    });
  }

}
