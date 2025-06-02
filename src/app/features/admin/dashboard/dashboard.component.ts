import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Start building your dashboard here -->
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
  `]
})
export class DashboardComponent {} 