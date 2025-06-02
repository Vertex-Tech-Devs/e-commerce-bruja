import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { ICartItem } from '@core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    OrderSummaryComponent
  ],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      
      <div class="checkout-content">
        <div class="checkout-form">
          <!-- Shipping Address Section -->
          <section class="section">
            <h2>Shipping Address</h2>
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" placeholder="Enter your address">
            </div>
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" placeholder="Enter your city">
            </div>
            <div class="form-group">
              <label for="zipCode">ZIP Code</label>
              <input type="text" id="zipCode" placeholder="Enter ZIP code">
            </div>
          </section>

          <!-- Payment Method Section -->
          <section class="section">
            <h2>Payment Method</h2>
            <div class="form-group">
              <label for="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" placeholder="Enter card number">
            </div>
            <div class="form-group">
              <label for="expiryDate">Expiry Date</label>
              <input type="text" id="expiryDate" placeholder="MM/YY">
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="Enter CVV">
            </div>
          </section>

          <button class="submit-button" type="submit">Place Order</button>
        </div>

        <app-order-summary 
          [items]="cartItems"
          [total]="total"
        ></app-order-summary>
      </div>
    </div>
  `,
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: ICartItem[] = [];
  total: number = 0;

  constructor() {
    // TODO: Initialize services
  }

  ngOnInit(): void {
    // TODO: Load cart items and calculate total
  }
} 