import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order, OrderItem } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SumItemsPipe } from '@features/admin/shared/pipes/sum-items/sum-items.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    SumItemsPipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _orderService = inject(OrderService);

  order$!: Observable<Order | undefined>;
  orderId: string | null = null;
  pageTitle: string = 'Detalles del Pedido';

  // Propiedades para el control de estado del pedido
  currentStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled' = 'pending';
  statusOptions: ('pending' | 'shipped' | 'delivered' | 'cancelled')[] = ['pending', 'shipped', 'delivered', 'cancelled'];

  ngOnInit(): void {
    this.order$ = this._route.paramMap.pipe(
      switchMap(params => {
        this.orderId = params.get('id');

        if (this.orderId) {
          return this._orderService.getOrderById(this.orderId).pipe(
            tap(order => {
              if (order) {
                this.pageTitle = `Detalles del Pedido #${order.id}`;
                this.currentStatus = order.status;
              } else {
                console.warn('Pedido no encontrado para el ID:', this.orderId);
                this.pageTitle = 'Pedido No Encontrado';
              }
            })
          );
        } else {
          console.error('No se proporcionó un ID de pedido en la ruta.');
          this.pageTitle = 'Error: ID de Pedido Faltante';
          this._router.navigate(['/admin/orders']);
          return of(undefined);
        }
      })
    );
  }

  goBack(): void {
    this._router.navigate(['/admin/orders']);
  }

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'pending' | 'shipped' | 'delivered' | 'cancelled';


    if (this.orderId && newStatus !== this.currentStatus) {
      console.log(`Actualizando estado del pedido ${this.orderId} a: ${newStatus}`);
      this._orderService.updateOrder(this.orderId, { status: newStatus })
        .then(() => {
          this.currentStatus = newStatus;
          console.log('Estado del pedido actualizado con éxito!');
        })
        .catch(error => {
          console.error('Error al actualizar el estado del pedido:', error);
        });
    }
  }

  getItemSubtotal(item: OrderItem): number {
    return item.quantity * item.price;
  }

  generateReceipt(): void {
    alert('Funcionalidad de generar recibo aún no implementada.');
    console.log('Generar recibo para el pedido:', this.orderId);
  }
}
