import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentReference, WithFieldValue } from '@angular/fire/firestore';

import { Category } from '@core/models/category.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestoreService = inject(FirestoreService<Category>);
  private readonly collectionPath = 'categories';

  getCategories(): Observable<Category[]> {
    return this.firestoreService.getAll(this.collectionPath);
  }

  addCategory(category: { name: string }): Promise<DocumentReference<Category>> {
    return this.firestoreService.create(this.collectionPath, category) as Promise<DocumentReference<Category>>;
  }

  updateCategory(id: string, category: Partial<Category>): Promise<void> {
    return this.firestoreService.update(this.collectionPath, id, category);
  }

  deleteCategory(id: string): Promise<void> {
    return this.firestoreService.delete(this.collectionPath, id);
  }
}
