import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
}
