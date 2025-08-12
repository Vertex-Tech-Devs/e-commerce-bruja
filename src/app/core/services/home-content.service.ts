import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeroBanner } from '../models/home-content.model';

@Injectable({
  providedIn: 'root'
})
export class HomeContentService {
  private firestore: Firestore = inject(Firestore);
  private readonly homeContentDocPath = 'homeContent/mainBanner';

  constructor() { }

  getHeroBanner(): Observable<HeroBanner | null> {
    const docRef = doc(this.firestore, this.homeContentDocPath);
    return docData(docRef, { idField: 'id' }) as Observable<HeroBanner | null>;
  }

  saveHeroBanner(bannerData: Partial<HeroBanner>): Promise<void> {
    const docRef = doc(this.firestore, this.homeContentDocPath);
    return setDoc(docRef, { ...bannerData, lastUpdated: new Date() }, { merge: true });
  }
}
