import { ConfirmDeleteModalComponent } from '@features/admin/components/shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


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
  totalStock = 0;
  private productSubscription: Subscription | undefined;
  private _modalService = inject(BsModalService);
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
          this.calculateTotalStock();
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

  calculateTotalStock(): void {
    if (this.product && this.product.variants) {
      this.totalStock = this.product.variants.reduce((acc, variant) => acc + variant.stock, 0);
    } else {
      this.totalStock = 0;
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
      return;
    }

    this.bsModalRef = this._modalService.show(ConfirmDeleteModalComponent, {
      initialState: {
        title: 'Confirmar Eliminación de Producto',
        message: `¿Estás seguro de que deseas eliminar el producto "${this.product.name}"? Esta acción no se puede deshacer.`,
      },
      class: 'modal-md modal-dialog-centered',
    });

    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result && this.product) {
        this.productService.deleteProduct(this.product.id).then(() => {
          this.router.navigate(['/admin/products']);
        });
      }
    });
  }
}
