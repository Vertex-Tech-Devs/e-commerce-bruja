import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  private authService = inject(AuthService);

  userName: string = 'Federico';

  constructor() { }

  ngOnInit(): void {
  }

  onToggleSidebar(event: Event): void {
    event.stopPropagation();
    this.toggleSidebarEvent.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
