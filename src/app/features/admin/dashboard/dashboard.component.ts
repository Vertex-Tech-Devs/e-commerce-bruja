import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, SidebarComponent],
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
