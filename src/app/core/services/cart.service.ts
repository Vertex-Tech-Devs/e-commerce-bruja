import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductVariant } from '@core/models/product.model';
import { ICart, ICartItem } from '@core/models/cart.model';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private sweetAlertService = inject(SweetAlertService);

  private readonly CART_STORAGE_KEY = 'my_cart';

  private cartSubject = new BehaviorSubject<ICart>(this.getCartFromStorage());
  public cart$: Observable<ICart> = this.cartSubject.asObservable();

  constructor() { }

  private getCartFromStorage(): ICart {
    try {
      const cartJson = localStorage.getItem(this.CART_STORAGE_KEY);
      if (cartJson) {
        return JSON.parse(cartJson);
      }
    } catch (error) {
      console.error('Error reading cart from localStorage', error);
      localStorage.removeItem(this.CART_STORAGE_KEY);
    }
    return { items: [], total: 0 };
  }

  private saveCartToStorage(cart: ICart): void {
    try {
      const cartJson = JSON.stringify(cart);
      localStorage.setItem(this.CART_STORAGE_KEY, cartJson);
      this.cartSubject.next(cart);
    } catch (error) {
      console.error('Error saving cart to localStorage', error);
    }
  }

  private calculateTotal(items: ICartItem[]): number {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  public addToCart(product: Product, variant: ProductVariant, quantity: number): void {
    const currentCart = this.cartSubject.getValue();
    const cartItemId = `${product.id}-${variant.size}-${variant.color}`;

    const existingItemIndex = currentCart.items.findIndex(item => item.id === cartItemId);

    if (existingItemIndex > -1) {
      const existingItem = currentCart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        this.sweetAlertService.error('Stock insuficiente', `No puedes añadir más unidades de este producto. Stock disponible: ${variant.stock}.`);
        return;
      }
      existingItem.quantity = newQuantity;
    } else {
      if (quantity > variant.stock) {
        this.sweetAlertService.error('Stock insuficiente', `No puedes añadir ${quantity} unidades. Stock disponible: ${variant.stock}.`);
        return;
      }
      const newItem: ICartItem = {
        id: cartItemId,
        productId: product.id,
        name: `${product.name} (${variant.size} - ${variant.color})`,
        price: product.price,
        quantity: quantity,
        image: product.image
      };
      currentCart.items.push(newItem);
    }

    currentCart.total = this.calculateTotal(currentCart.items);
    this.saveCartToStorage(currentCart);
    this.sweetAlertService.success('¡Añadido!', 'Producto añadido al carrito.');
  }

  public updateItemQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.getValue();
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      currentCart.items[itemIndex].quantity = quantity;
      currentCart.total = this.calculateTotal(currentCart.items);
      this.saveCartToStorage(currentCart);
    }
  }

  public removeItem(itemId: string): void {
    const currentCart = this.cartSubject.getValue();
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    currentCart.total = this.calculateTotal(currentCart.items);
    this.saveCartToStorage(currentCart);
    this.sweetAlertService.success('Eliminado', 'El producto ha sido eliminado del carrito.');
  }

  public clearCart(): void {
    const emptyCart: ICart = { items: [], total: 0 };
    this.saveCartToStorage(emptyCart);
  }
}
