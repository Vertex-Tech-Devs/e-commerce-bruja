import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { OrdersListComponent } from '../orders/orders-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, OrdersListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  public totalProducts$!: Observable<number>;

  ngOnInit(): void {
    this.totalProducts$ = this.productService.getProducts().pipe(
      map(products => products.length)
    );
  }
}
