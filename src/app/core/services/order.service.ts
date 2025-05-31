import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { IOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore) {}

  async createOrder(order: IOrder): Promise<string> {
    const ordersRef = collection(this.firestore, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async getOrder(orderId: string): Promise<IOrder | null> {
    const orderRef = doc(this.firestore, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as IOrder;
    }
    return null;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IOrder[];
  }

  async updateOrderStatus(orderId: string, status: IOrder['status']): Promise<void> {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
  }
} 