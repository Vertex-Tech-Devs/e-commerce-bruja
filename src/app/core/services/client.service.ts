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
          const orderDate = new Date(order.orderDate);

          if (!clientsMap.has(email)) {
            clientsMap.set(email, {
              email: email,
              fullName: fullName,
              phone: phone,
              firstOrderDate: orderDate,
              numberOfOrders: 1,
            });
          } else {
            const existingClient = clientsMap.get(email)!;
            existingClient.numberOfOrders++;

            if (orderDate < existingClient.firstOrderDate) {
              existingClient.firstOrderDate = orderDate;
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

  getTotalClients(): Observable<number> {
    return this.getClients().pipe(
      map(clients => clients.length)
    );
  }

  getNewClientsThisMonth(): Observable<number> {
    return this.getClients().pipe(
      map(clients => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return clients.filter(client => {
          const firstOrderDate = new Date(client.firstOrderDate); // Asegúrate de que es un Date
          return firstOrderDate.getMonth() === currentMonth && firstOrderDate.getFullYear() === currentYear;
        }).length;
      })
    );
  }

  getLatestClients(limit: number = 10): Observable<Client[]> {
    return this.getClients().pipe(
      map(clients =>
        clients.sort((a, b) => new Date(b.firstOrderDate).getTime() - new Date(a.firstOrderDate).getTime())
          .slice(0, limit)
      )
    );
  }
}
