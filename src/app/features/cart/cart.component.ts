import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ICartItem } from '@core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CartItemComponent
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: ICartItem[] = [];
  total: number = 0;

  constructor() {
    // TODO: Initialize services
  }

  ngOnInit(): void {
    // TODO: Load cart items and calculate total
  }

  onUpdateQuantity(event: { id: string; quantity: number }): void {
    // TODO: Update item quantity
  }

  onRemoveItem(id: string): void {
    // TODO: Remove item from cart
  }
} 