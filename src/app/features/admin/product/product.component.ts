import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  description: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports:[ CommonModule , RouterModule ],
  standalone: true,
})
export class ProductComponent implements OnInit {

  products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    this.products = [
      {
        id: 1,
        name: 'Zapatillas Urbanas',
        price: 90.000,
        image: 'https://via.placeholder.com/50x50/007bff/ffffff?text=ZAP',
        category: 'Calzado',
        size: '40',
        description: 'Zapatillas cómodas para el día a día.'
      },
      {
        id: 2,
        name: 'Remera Algodón',
        price: 25.000,
        image: 'https://via.placeholder.com/50x50/28a745/ffffff?text=REM',
        category: 'Indumentaria',
        size: 'M',
        description: 'Remera básica de algodón suave.'
      },
      {
        id: 3,
        name: 'Pantalón Jean',
        price: 70.000,
        image: 'https://via.placeholder.com/50x50/ffc107/000000?text=PANT',
        category: 'Indumentaria',
        size: '32',
        description: 'Jean clásico de corte recto.'
      },
      {
        id: 4,
        name: 'Gorra Deportiva',
        price: 15.00,
        image: 'https://via.placeholder.com/50x50/dc3545/ffffff?text=GORRA',
        category: 'Accesorios',
        size: 'Único',
        description: 'Gorra ideal para actividades al aire libre.'
      }
    ];
  }

  editProduct(product: Product): void {
    alert(`Editar producto: ${product.name}`);
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que quieres eliminar ${product.name}?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      alert(`${product.name} eliminado.`);
    }
  }

  newProduct(): void {
    alert('Crear nuevo producto');
  }
}
