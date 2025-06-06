import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
<<<<<<< HEAD
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
=======
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      Dashboard
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
  `]
>>>>>>> 0d5a447835de600f72df83d11a7b36c8f10ff561
})
export class DashboardComponent {

}
