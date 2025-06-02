import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICartItem } from '@core/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <!-- TODO: Implement cart item template -->
    </div>
  `,
  styles: [`
    .cart-item {
      /* TODO: Implement cart item styles */
    }
  `]
})
export class CartItemComponent {
  @Input() item!: ICartItem;
  @Output() updateQuantity = new EventEmitter<{id: string, quantity: number}>();
  @Output() removeItem = new EventEmitter<string>();
} 