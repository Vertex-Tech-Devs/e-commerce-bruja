import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];

  constructor() {
    // TODO: Initialize services
  }

  ngOnInit(): void {
    // TODO: Load products
  }
} 