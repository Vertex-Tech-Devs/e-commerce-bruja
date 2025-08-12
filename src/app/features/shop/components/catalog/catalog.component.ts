import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);

  public products$!: Observable<Product[]>;

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }
}
