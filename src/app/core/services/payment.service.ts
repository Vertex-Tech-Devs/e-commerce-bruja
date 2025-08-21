import { Injectable } from '@angular/core';
import { ICartItem } from '@core/models/cart.model';

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  initiatePayment(items: ICartItem[], total: number): Promise<PaymentResponse> {
    console.log('Iniciando pago simulado...');
    console.log('Items:', items);
    console.log('Total a pagar:', total);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() < 0.9;

        if (isSuccess) {
          console.log('✅ Pago simulado APROBADO');
          const response: PaymentResponse = {
            success: true,
            transactionId: `mp-mock-${Date.now()}`
          };
          resolve(response);
        } else {
          console.error('❌ Pago simulado RECHAZADO');
          const response: PaymentResponse = {
            success: false,
            error: 'Fondos insuficientes (error simulado)'
          };
          reject(response);
        }
      }, 2000);
    });
  }
}
