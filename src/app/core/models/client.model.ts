export interface Client {
  email: string;
  fullName: string;
  phone: string;
  firstOrderDate: Date;
  numberOfOrders: number;
}

export interface OrderClientData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  orderDate: Date;

}
