import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, DocumentReference, UpdateData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// A base interface to ensure our data can have an ID field.
interface BaseEntity {
    id?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreService<T extends BaseEntity> {
    private firestore: Firestore = inject(Firestore);

    // Gets all documents from a collection.
    getAll(path: string): Observable<T[]> {
        const collectionRef = collection(this.firestore, path);
        return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
    }

    // Gets a specific document by its ID.
    get(path: string, id: string): Observable<T> {
        const documentRef = doc(this.firestore, `${path}/${id}`);
        return docData(documentRef, { idField: 'id' }) as Observable<T>;
    }

    // Creates a new document in a collection.
    create(path: string, data: T): Promise<DocumentReference> {
        const collectionRef = collection(this.firestore, path);
        return addDoc(collectionRef, data);
    }

    // Updates an existing document.
    update(path: string, id: string, data: Partial<T>): Promise<void> {
        const documentRef = doc(this.firestore, `${path}/${id}`);
        return updateDoc(documentRef, data as UpdateData<T>);
    }

    // Deletes a document.
    delete(path: string, id: string): Promise<void> {
        const documentRef = doc(this.firestore, `${path}/${id}`);
        return deleteDoc(documentRef);
    }
}