export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
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
  orderDate: Date;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}
