import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../../../core/services/client.service';
import { Client } from '../../../../../core/models/client.model';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  map,
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent implements OnInit {
  public searchTermSubject = new BehaviorSubject<string>('');
  public currentPageSubject = new BehaviorSubject<number>(1);
  public itemsPerPageSubject = new BehaviorSubject<number>(10);
  public itemsPerPageOptions = [5, 10, 20, 50];

  public totalClients = 0;
  public totalPages = 0;

  public clients$!: Observable<Client[]>;

  private _clientService = inject(ClientService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.clients$ = combineLatest([
      this._clientService.getClients(),
      this.searchTermSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.currentPageSubject,
      this.itemsPerPageSubject
    ]).pipe(
      map(([allClients, searchTerm, currentPage, itemsPerPage]) => {
        let filteredClients = allClients;
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredClients = filteredClients.filter(client =>
            client.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
            client.email.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }

        this.totalClients = filteredClients.length;
        this.totalPages = Math.ceil(this.totalClients / itemsPerPage);

        if (currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPageSubject.next(this.totalPages);
          currentPage = this.totalPages;
        } else if (this.totalPages === 0) {
          this.currentPageSubject.next(1);
          currentPage = 1;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredClients.slice(startIndex, startIndex + itemsPerPage);
      })
    );
  }

  onSearchChange(newValue: string): void {
    this.searchTermSubject.next(newValue);
    this.currentPageSubject.next(1);
  }

  onItemsPerPageChange(newValue: string): void {
    this.itemsPerPageSubject.next(Number(newValue));
    this.currentPageSubject.next(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageSubject.next(page);
    }
  }

  viewClientHistory(email: string): void {
    this._router.navigate(['/admin/clients', email, 'details']);
  }
}
