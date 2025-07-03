import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  UpdateData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BaseEntity {
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends BaseEntity> {
  private firestore: Firestore = inject(Firestore);

  constructor() { }


  private _convertTimestampsToDates(data: any): any {
    if (!data) {
      return data;
    }

    if (data instanceof Timestamp) {
      return data.toDate();
    }

    if (Array.isArray(data)) {
      return data.map(item => this._convertTimestampsToDates(item));
    }

    if (typeof data === 'object' && data !== null) {
      const convertedData: { [key: string]: any } = {};
      for (const key in data) {

        if (Object.prototype.hasOwnProperty.call(data, key)) {
          convertedData[key] = this._convertTimestampsToDates(data[key]);
        }
      }
      return convertedData;
    }
    return data;
  }


  getAll(path: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, path);
    return (collectionData(collectionRef, { idField: 'id' }) as Observable<any[]>).pipe(
      map(items => items.map(item => this._convertTimestampsToDates(item) as T))
    );
  }

  get(path: string, id: string): Observable<T> {
    const documentRef = doc(this.firestore, `${path}/${id}`);
    return (docData(documentRef, { idField: 'id' }) as Observable<any>).pipe(
      map(item => this._convertTimestampsToDates(item) as T)
    );
  }

  create(path: string, data: T): Promise<DocumentReference> {
    const collectionRef = collection(this.firestore, path);
    return addDoc(collectionRef, data);
  }

  update(path: string, id: string, data: Partial<T>): Promise<void> {
    const documentRef = doc(this.firestore, `${path}/${id}`);
    return updateDoc(documentRef, data as UpdateData<T>);
  }

  delete(path: string, id: string): Promise<void> {
    const documentRef = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(documentRef);
  }
}
