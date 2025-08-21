import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { WithFieldValue } from '@angular/fire/firestore';

import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CartService } from '@core/services/cart.service';
import { ICartItem } from '@core/models/cart.model';
import { PaymentService, PaymentResponse } from '@core/services/payment.service';
import { SweetAlertService } from '@core/services/sweet-alert.service';
import { OrderService } from '@core/services/order.service';
import { Order, OrderItem } from '@core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    OrderSummaryComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private paymentService = inject(PaymentService);
  private sweetAlertService = inject(SweetAlertService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  public checkoutForm!: FormGroup;
  public cartItems$: Observable<ICartItem[]>;
  public cartTotal$: Observable<number>;
  public isProcessingPayment = false;

  constructor() {
    this.cartItems$ = this.cartService.cart$.pipe(map(cart => cart.items));
    this.cartTotal$ = this.cartService.cart$.pipe(map(cart => cart.total));
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      contactInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]]
      }),
      shippingInfo: this.fb.group({
        address: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(3)]],
        zipCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- ]{3,10}$')]],
        province: ['', [Validators.required, Validators.minLength(4)]]
      })
    });
  }

  get contactControls() { return (this.checkoutForm.get('contactInfo') as FormGroup).controls; }
  get shippingControls() { return (this.checkoutForm.get('shippingInfo') as FormGroup).controls; }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.sweetAlertService.error('Formulario Incompleto', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    this.isProcessingPayment = true;
    const cart = await this.cartService.cart$.pipe(take(1)).toPromise();

    if (!cart || cart.items.length === 0) {
      this.sweetAlertService.error('Carrito Vacío', 'No puedes proceder al pago sin productos.');
      this.isProcessingPayment = false;
      this.router.navigate(['/shop/cart']);
      return;
    }

    try {
      const paymentResult = await this.paymentService.initiatePayment(cart.items, cart.total);
      if (paymentResult.success) {
        await this.createOrder(cart.items, cart.total, paymentResult);
      }
    } catch (error) {
      console.error('Error en el pago:', error);
      const paymentError = error as PaymentResponse;
      this.sweetAlertService.error('Pago Rechazado', paymentError.error || 'Ocurrió un error inesperado.');
    } finally {
      this.isProcessingPayment = false;
    }
  }

  private async createOrder(cartItems: ICartItem[], total: number, paymentResult: PaymentResponse): Promise<void> {
    const { contactInfo, shippingInfo } = this.checkoutForm.value;

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      productImage: item.image || ''
    }));

    const newOrder: WithFieldValue<Omit<Order, 'id'>> = {
      userId: 'anonymous-user',
      clientName: `${contactInfo.firstName} ${contactInfo.lastName}`,
      clientEmail: contactInfo.email,
      clientPhone: contactInfo.phone,
      orderDate: new Date(),
      total: total,
      status: 'pending',
      items: orderItems,
      shippingAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.province,
        zipCode: shippingInfo.zipCode,
        country: 'Argentina'
      },
      paymentMethod: 'Mercado Pago (Simulado)',
      subtotal: total,
    };

    try {
      this.sweetAlertService.loading('Creando tu pedido...', 'Por favor, espera.');
      const orderRef = await this.orderService.createOrder(newOrder);
      this.cartService.clearCart();
      this.sweetAlertService.close();
      this.router.navigate(['/shop/order-confirmation', orderRef.id]);
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      this.sweetAlertService.error('Error Crítico', 'Tu pago fue aprobado, pero no pudimos registrar tu pedido. Por favor, contacta a soporte.');
    }
  }
}
