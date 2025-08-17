import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DocumentReference, WithFieldValue } from '@angular/fire/firestore';
import { Product } from '../models/product.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestoreService = inject(FirestoreService<Product>);
  private readonly collectionPath = 'products';

  getProducts(): Observable<Product[]> {
    return this.firestoreService.getAll(this.collectionPath);
  }

  getProductById(id: string): Observable<Product> {
    return this.firestoreService.get(this.collectionPath, id);
  }

  createProduct(product: WithFieldValue<Product>): Promise<DocumentReference<Product>> {
    return this.firestoreService.create(this.collectionPath, product) as Promise<DocumentReference<Product>>;
  }

  updateProduct(id: string, product: Partial<Product>): Promise<void> {
    return this.firestoreService.update(this.collectionPath, id, product);
  }

  deleteProduct(id: string): Promise<void> {
    return this.firestoreService.delete(this.collectionPath, id);
  }

  getProductsLowInStock(threshold: number = 5): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => {
        const totalStock = product.variants?.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;
        return totalStock <= threshold;
      }).sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getLatestProducts(limit: number = 10): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        if (products.some(p => (p as any).createdAt instanceof Date)) {
          return products.sort((a, b) => {
            const dateA = (a as any).createdAt instanceof Date ? (a as any).createdAt.getTime() : 0;
            const dateB = (b as any).createdAt instanceof Date ? (b as any).createdAt.getTime() : 0;
            return dateB - dateA;
          }).slice(0, limit);
        } else {
          console.warn("Product.createdAt no es un Date. Los últimos productos se mostrarán por orden de llegada de la base de datos.");
          return products.slice(0, limit);
        }
      })
    );
  }
}
