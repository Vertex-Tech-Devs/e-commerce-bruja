import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Order } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe
  ],
})
export class OrdersListComponent implements OnInit {
  private _orderService = inject(OrderService);
  private _router = inject(Router);

  currentPageSubject = new BehaviorSubject<number>(1);
  itemsPerPageSubject = new BehaviorSubject<number>(10);
  itemsPerPageOptions = [5, 10, 20, 50];

  totalOrders = 0;
  totalPages = 0;

  searchTermSubject = new BehaviorSubject<string>('');
  filterStatusSubject = new BehaviorSubject<string>('all');
  statusOptions = ['all', 'pending', 'shipped', 'delivered', 'cancelled'];

  orders$!: Observable<Order[]>;

  ngOnInit(): void {
    this.orders$ = combineLatest([
      this._orderService.getOrders(),
      this.searchTermSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.filterStatusSubject,
      this.currentPageSubject,
      this.itemsPerPageSubject
    ]).pipe(
      map(([orders, searchTerm, filterStatus, currentPage, itemsPerPage]) => {
        let filteredOrders = orders.filter(order =>
          order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterStatus !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }

        this.totalOrders = filteredOrders.length;
        this.totalPages = Math.ceil(this.totalOrders / itemsPerPage);

        if (currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPageSubject.next(this.totalPages);
          currentPage = this.totalPages;
        } else if (this.totalPages === 0 && currentPage !== 1) {
          this.currentPageSubject.next(1);
          currentPage = 1;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;


        return filteredOrders.slice(startIndex, endIndex);
      })
    );
  }

  // --- Métodos para Paginación ---
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageSubject.next(page);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPageSubject.next(Number(selectElement.value));
    this.currentPageSubject.next(1);
  }

  // --- Métodos para Filtros y Búsqueda ---
  onSearchTermChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTermSubject.next(inputElement.value);
    this.currentPageSubject.next(1);
  }

  onFilterStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterStatusSubject.next(selectElement.value);
    this.currentPageSubject.next(1);
  }

  // --- Métodos de Acción ---
  editOrder(order: Order): void {
    console.log('Editar pedido:', order.id);
    this._router.navigate(['/admin/orders/edit', order.id]);
  }

  deleteOrder(order: Order): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el pedido ${order.id}? Esta acción no se puede deshacer.`)) {
      from(this._orderService.deleteOrder(order.id)).subscribe({
        next: () => {
          console.log('Pedido eliminado con éxito:', order.id);
          this.orders$ = combineLatest([
            this._orderService.getOrders(),
            this.searchTermSubject.pipe(debounceTime(300), distinctUntilChanged()),
            this.filterStatusSubject,
            this.currentPageSubject,
            this.itemsPerPageSubject
          ]).pipe(
            map(([orders, searchTerm, filterStatus, currentPage, itemsPerPage]) => {
              let filteredOrders = orders.filter(o =>
                o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.status.toLowerCase().includes(searchTerm.toLowerCase())
              );
              if (filterStatus !== 'all') {
                filteredOrders = filteredOrders.filter(o => o.status === filterStatus);
              }
              this.totalOrders = filteredOrders.length;
              this.totalPages = Math.ceil(this.totalOrders / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              return filteredOrders.slice(startIndex, endIndex);
            })
          );
        },
        error: (error: any) => {
          console.error('Error al eliminar el pedido:', error);
        }
      });
    }
  }
}
