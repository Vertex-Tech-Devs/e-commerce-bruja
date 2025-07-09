import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Product } from '@core/models/product.model';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    FormsModule,
    TitleCasePipe
  ],
  standalone: true,
})
export class ProductsListComponent implements OnInit, OnDestroy {
  public products$!: Observable<Product[]>;
  private _productService = inject(ProductService);
  private _router = inject(Router);

  public searchTermSubject = new BehaviorSubject<string>('');


  public filterCategorySubject = new BehaviorSubject<string>('all');

  public categoryOptions = ['todo', 'indumentaria', 'accesorios', 'bermudas', 'camisas'];

  public currentPageSubject = new BehaviorSubject<number>(1);
  public itemsPerPageSubject = new BehaviorSubject<number>(10);
  public itemsPerPageOptions = [5, 10, 20, 50];

  public totalProducts = 0;
  public totalPages = 0;

  private productsSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.products$ = combineLatest([
      this._productService.getProducts(),
      this.searchTermSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.filterCategorySubject,
      this.currentPageSubject,
      this.itemsPerPageSubject
    ]).pipe(
      map(([allProducts, searchTerm, filterCategory, currentPage, itemsPerPage]) => {
        let filteredProducts = allProducts;
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.category.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }


        if (filterCategory !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === filterCategory.toLowerCase()
          );
        }

        // Paginación
        this.totalProducts = filteredProducts.length;
        this.totalPages = Math.ceil(this.totalProducts / itemsPerPage);

        if (currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPageSubject.next(this.totalPages);
          currentPage = this.totalPages;
        } else if (this.totalPages === 0 && currentPage !== 1) {
          this.currentPageSubject.next(1);
          currentPage = 1;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filteredProducts.slice(startIndex, endIndex);
      })
    );
  }

  // Métodos de control
  onSearchChange(newValue: string): void {
    this.searchTermSubject.next(newValue);
    this.currentPageSubject.next(1);
  }

  // Método para el filtro de categoría
  onFilterCategoryChange(newValue: string): void {
    this.filterCategorySubject.next(newValue);
    this.currentPageSubject.next(1);
  }

  // Métodos para la paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageSubject.next(page);
    }
  }

  onItemsPerPageChange(newValue: string): void {
    this.itemsPerPageSubject.next(Number(newValue));
    this.currentPageSubject.next(1);
  }


  ngOnDestroy(): void {
    this.searchTermSubject.complete();
    this.filterCategorySubject.complete();
    this.currentPageSubject.complete();
    this.itemsPerPageSubject.complete();
  }

  editProduct(product: Product): void {
    console.log('Funcionalidad para editar producto:', product.name);
    this._router.navigate(['/admin/products/edit', product.id]);
  }

  deleteProduct(product: Product): void {
    console.log('Intento de eliminar producto:', product.name);
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`);

    if (confirmed) {
      this._productService.deleteProduct(product.id)
        .then(() => {
          console.log('Producto eliminado con éxito:', product.name);
          this.searchTermSubject.next(this.searchTermSubject.value);
        })
        .catch((err) => {
          console.error('Error al eliminar el producto:', err);
        });
    } else {
      console.log('Eliminación cancelada para el producto:', product.name);
    }
  }

  newProduct(): void {
    this._router.navigate(['/admin/products/create']);
  }
}
