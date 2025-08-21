import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ICart, ICartItem } from '@core/models/cart.model';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  public cart$: Observable<ICart>;

  constructor() {
    this.cart$ = this.cartService.cart$;
  }

  public goToCheckout(): void {
    this.router.navigate(['/shop/checkout']);
  }

  public onUpdateQuantity(itemId: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);
    if (!isNaN(newQuantity)) {
      this.cartService.updateQuantity(itemId, newQuantity);
    }
  }

  public onRemoveItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  public trackByItemId(index: number, item: ICartItem): string {
    return item.id;
  }
}
