import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models/client.model';
import {
  Observable,
  BehaviorSubject,
  Subscription,
  combineLatest
} from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent implements OnInit, OnDestroy {
  searchTermSubject = new BehaviorSubject<string>('');

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  clients$!: Observable<Client[]>;

  private _clientService = inject(ClientService);
  private _router = inject(Router);

  constructor() { }
  ngOnInit(): void {
    this.clients$ = combineLatest([
      this._clientService.getClients(),
      this.searchTermSubject.pipe(debounceTime(300), distinctUntilChanged()),
    ]).pipe(
      map(([allClients, searchTerm]) => {
        let tempClients = allClients;

        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          tempClients = tempClients.filter(client =>
            client.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
            client.email.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }


        this.totalPages = Math.max(1, Math.ceil(tempClients.length / this.itemsPerPage));


        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }


        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return tempClients.slice(startIndex, endIndex);
      })
    );
  }

  ngOnDestroy(): void {
    this.searchTermSubject.complete();
  }

  onSearchChange(newValue: string): void {
    console.log('ClientsListComponent: onSearchChange - Nuevo valor del input:', newValue);
    this.searchTermSubject.next(newValue);
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewClientHistory(email: string): void {
    this._router.navigate(['/admin/clients', email, 'details']);
  }
}
