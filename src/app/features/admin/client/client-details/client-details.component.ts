import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models/client.model';


@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
  ],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  clientEmail: string | null = null;
  clientDetails: Client | undefined;
  private routeSubscription: Subscription | undefined;
  private clientSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.clientEmail = params.get('email'); // 'email' debe coincidir con el nombre del parámetro en la ruta

      if (this.clientEmail) {
        console.log('Cargando detalles para el cliente con email:', this.clientEmail);
        this.loadClientDetails(this.clientEmail);
      } else {
        console.warn('No se encontró el email del cliente en la URL.');
        this.router.navigate(['/admin/customers']);
      }
    });
  }

  loadClientDetails(email: string): void {
    this.clientSubscription = this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clientDetails = clients.find((client) => client.email === email);
        if (!this.clientDetails) {
          console.warn(`Cliente con email ${email} no encontrado.`);
          this.router.navigate(['/admin/customers']);
        }
      },
      error: (err) => {
        console.error('Error al cargar detalles del cliente:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.clientSubscription?.unsubscribe();
  }

  goBackToList(): void {
    this.router.navigate(['/admin/customers']);
  }
}
