import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client, OrderClientData } from '../models/client.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  // Simulación de datos de pedidos
  private mockOrdersData: OrderClientData[] = [
    {
      email: 'juan.perez@example.com',
      firstName: 'Juan',
      lastName: 'Perez',
      phone: '1122334455',
      orderDate: new Date('2023-01-15T10:00:00Z'),
    },
    {
      email: 'maria.gomez@example.com',
      firstName: 'Maria',
      lastName: 'Gomez',
      phone: '2233445566',
      orderDate: new Date('2023-02-20T14:30:00Z'),
    },
    {
      email: 'juan.perez@example.com',
      firstName: 'Juan',
      lastName: 'Perez',
      phone: '1122334455',
      orderDate: new Date('2023-03-01T09:00:00Z'),
    },
    {
      email: 'carlos.lopez@example.com',
      firstName: 'Carlos',
      lastName: 'Lopez',
      phone: '3344556677',
      orderDate: new Date('2023-04-10T11:45:00Z'),
    },
    {
      email: 'maria.gomez@example.com',
      firstName: 'Maria',
      lastName: 'Gomez',
      phone: '2233445566',
      orderDate: new Date('2023-05-05T16:00:00Z'),
    },
    {
      email: 'ana.ruiz@example.com',
      firstName: 'Ana',
      lastName: 'Ruiz',
      phone: '4455667788',
      orderDate: new Date('2023-06-01T10:15:00Z'),
    },
  ];

  constructor() { }

  getClients(): Observable<Client[]> {
    return of(this.mockOrdersData).pipe(
      map((orders) => {
        const clientsMap = new Map<string, Client>();

        orders.forEach((order) => {
          const email = order.email;
          if (!clientsMap.has(email)) {
            clientsMap.set(email, {
              email: email,
              fullName: `${order.firstName} ${order.lastName}`,
              phone: order.phone,
              firstOrderDate: order.orderDate,
              numberOfOrders: 1,
            });
          } else {
            const existingClient = clientsMap.get(email)!;
            existingClient.numberOfOrders++;
            if (order.orderDate < existingClient.firstOrderDate) {
              existingClient.firstOrderDate = order.orderDate;
            }
            clientsMap.set(email, existingClient);
          }
        });
        return Array.from(clientsMap.values());
      })
    );
  }
}
