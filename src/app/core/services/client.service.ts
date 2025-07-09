import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private _orderService = inject(OrderService);

  constructor() { }

  getClients(): Observable<Client[]> {
    return this._orderService.getOrders().pipe(
      map((orders: Order[]) => {
        const clientsMap = new Map<string, Client>();

        orders.forEach((order) => {
          if (!order.clientEmail) {
            console.warn('Order ID:', order.id, 'does not have a clientEmail and will be skipped for client aggregation.');
            return;
          }

          const email = order.clientEmail;
          const fullName = order.clientName;
          const phone = order.clientPhone ?? 'No proporcionado';

          if (!clientsMap.has(email)) {
            clientsMap.set(email, {
              email: email,
              fullName: fullName,
              phone: phone,
              firstOrderDate: new Date(order.orderDate),
              numberOfOrders: 1,
            });
          } else {
            const existingClient = clientsMap.get(email)!;
            existingClient.numberOfOrders++;

            if (new Date(order.orderDate) < existingClient.firstOrderDate) {
              existingClient.firstOrderDate = new Date(order.orderDate);
            }
            clientsMap.set(email, existingClient);
          }
        });

        return Array.from(clientsMap.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
      })
    );
  }


  getOrdersByClientEmail(email: string): Observable<Order[]> {
    return this._orderService.getOrders().pipe(
      map((orders: Order[]) => {
        return orders.filter(order => order.clientEmail === email);
      })
    );
  }
}
