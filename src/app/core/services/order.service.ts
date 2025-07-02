import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentReference, WithFieldValue } from '@angular/fire/firestore';
import { Order } from '../models/order.model';
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

  createOrder(order: WithFieldValue<Order>): Promise<DocumentReference<Order>> {
    return this.firestoreService.create(this.collectionPath, order) as Promise<DocumentReference<Order>>;
  }

  updateOrder(id: string, order: Partial<Order>): Promise<void> {
    return this.firestoreService.update(this.collectionPath, id, order);
  }

  deleteOrder(id: string): Promise<void> {
    return this.firestoreService.delete(this.collectionPath, id);
  }
}
