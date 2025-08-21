import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DocumentReference, WithFieldValue } from '@angular/fire/firestore';
import { Order, OrderStatus } from '../models/order.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestoreService = inject(FirestoreService<Order>);
  private readonly collectionPath = 'orders';

  getOrders(): Observable<Order[]> {
    return this.firestoreService.getAll(this.collectionPath);
  }

  getOrderById(id: string): Observable<Order> {
    return this.firestoreService.get(this.collectionPath, id);
  }

  createOrder(order: WithFieldValue<Omit<Order, 'id'>>): Promise<DocumentReference<Order>> {
    return this.firestoreService.create(this.collectionPath, order) as Promise<DocumentReference<Order>>;
  }

  updateOrder(id: string, order: Partial<Order>): Promise<void> {
    return this.firestoreService.update(this.collectionPath, id, order);
  }

  deleteOrder(id: string): Promise<void> {
    return this.firestoreService.delete(this.collectionPath, id);
  }

  getGlobalSalesAndOrders(): Observable<{ totalSales: number; totalOrders: number }> {
    return this.getOrders().pipe(
      map(orders => {
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        return { totalSales, totalOrders };
      })
    );
  }

  getMonthlySalesAndOrders(): Observable<{ monthlySales: number; monthlyOrders: number }> {
    return this.getOrders().pipe(
      map(orders => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

        return { monthlySales, monthlyOrders: monthlyOrders.length };
      })
    );
  }

  getPendingOrProcessingOrders(): Observable<Order[]> {
    return this.getOrders().pipe(
      map(orders => orders.filter(order =>
        order.status === 'pending' || order.status === 'processing'
      ).sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()))
    );
  }

  getLatestOrders(limit: number = 10): Observable<Order[]> {
    return this.getOrders().pipe(
      map(orders =>
        orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, limit)
      )
    );
  }
}
