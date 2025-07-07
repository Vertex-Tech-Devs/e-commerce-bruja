export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  orderDate: Date;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod?: string;
  shippingCost?: number;
  taxAmount?: number;
  subtotal?: number;
}
