export interface ICartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}
