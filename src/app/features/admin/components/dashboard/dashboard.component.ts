import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { OrderService } from '@core/services/order.service';
import { ClientService } from '@core/services/client.service';
import { Order } from '@core/models/order.model';
import { Product } from '@core/models/product.model';
import { Client } from '@core/models/client.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    RouterModule
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private clientService = inject(ClientService);

  // --- Observables para el Resumen Rápido (Números Clave) ---
  public monthlyMetrics$!: Observable<{ sales: number; orders: number; newClients: number }>;
  public globalMetrics$!: Observable<{ totalSales: number; totalOrders: number; totalClients: number }>;

  // --- Observables para Tareas Pendientes ---
  public pendingOrders$!: Observable<Order[]>;
  public lowStockProducts$!: Observable<Product[]>;

  // --- Observables para Actividad Reciente ---
  public latestOrders$!: Observable<Order[]>;
  public latestClients$!: Observable<Client[]>;
  public latestProducts$!: Observable<Product[]>;

  ngOnInit(): void {
    // 1. Resumen Rápido (Los Números Clave)
    this.monthlyMetrics$ = combineLatest([
      this.orderService.getMonthlySalesAndOrders(),
      this.clientService.getNewClientsThisMonth()
    ]).pipe(
      map(([orderStats, newClientsCount]) => ({
        sales: orderStats.monthlySales,
        orders: orderStats.monthlyOrders,
        newClients: newClientsCount
      }))
    );

    this.globalMetrics$ = combineLatest([
      this.orderService.getGlobalSalesAndOrders(),
      this.clientService.getTotalClients()
    ]).pipe(
      map(([orderStats, totalClientsCount]) => ({
        totalSales: orderStats.totalSales,
        totalOrders: orderStats.totalOrders,
        totalClients: totalClientsCount
      }))
    );

    // 2. Tareas Pendientes
    this.pendingOrders$ = this.orderService.getPendingOrProcessingOrders();
    this.lowStockProducts$ = this.productService.getProductsLowInStock(5);

    // 3. Actividad Reciente
    this.latestOrders$ = this.orderService.getLatestOrders(10);
    this.latestClients$ = this.clientService.getLatestClients(10);
    this.latestProducts$ = this.productService.getLatestProducts(10);
  }
}
