import { ICartItem } from './cart.model';

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export interface IOrder {
  id: string;
  userId: string;
  items: ICartItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: IPaymentMethod;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
} 