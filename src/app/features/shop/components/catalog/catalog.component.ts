import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, debounceTime, take, tap } from 'rxjs/operators';

import { Product } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  public products$!: Observable<Product[]>;
  public categories$!: Observable<Category[]>;
  public availableSizes: string[] = [];

  public filterForm!: FormGroup;
  private sortSubject = new BehaviorSubject<string>('newest');

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.filterForm = this.fb.group({
      category: ['all'],
      sizes: this.fb.group({}), // Se inicializa vacío y se llena dinámicamente
      minPrice: [null],
      maxPrice: [null]
    });

    this.applyInitialCategoryFilter();

    const allProducts$ = this.productService.getProducts().pipe(
      tap(products => this.populateSizeFilters(products))
    );
    const filters$ = this.filterForm.valueChanges.pipe(startWith(this.filterForm.value), debounceTime(300));

    this.products$ = combineLatest([allProducts$, filters$, this.sortSubject]).pipe(
      map(([products, filters, sort]) => {
        let filteredProducts = [...products];

        if (filters.category && filters.category !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }

        const selectedSizes = Object.keys(filters.sizes).filter(size => filters.sizes[size]);
        if (selectedSizes.length > 0) {
          filteredProducts = filteredProducts.filter(p =>
            p.variants && p.variants.some(variant => selectedSizes.includes(variant.size))
          );
        }

        if (filters.minPrice !== null) {
          filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== null && filters.maxPrice > 0) {
          filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
        }

        if (sort === 'priceAsc') {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'priceDesc') {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sort === 'newest') {
          filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filteredProducts;
      })
    );
  }

  private populateSizeFilters(products: Product[]): void {
    const allSizes = new Set<string>();
    products.forEach(p => {
      if (p.variants) {
        p.variants.forEach(v => allSizes.add(v.size));
      }
    });

    this.availableSizes = Array.from(allSizes).sort(); // Ordena los talles
    const sizeControls = this.availableSizes.reduce((acc, size) => ({ ...acc, [size]: false }), {});
    this.filterForm.setControl('sizes', this.fb.group(sizeControls));
  }

  private applyInitialCategoryFilter(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.filterForm.patchValue({ category: category });
      }
    });
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortSubject.next(selectElement.value);
  }

  clearFilters(): void {
    this.filterForm.reset({
      category: 'all',
      minPrice: null,
      maxPrice: null
    });
    const sizeControls = (this.filterForm.get('sizes') as FormGroup).controls;
    Object.keys(sizeControls).forEach(key => sizeControls[key].setValue(false));
  }
}
