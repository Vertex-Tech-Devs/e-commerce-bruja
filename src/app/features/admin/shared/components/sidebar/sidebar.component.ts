import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {

  isOpen: boolean = false;
  isMobile: boolean = false;

  constructor() { }

  ngOnInit() {
    this.checkMobileStatus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkMobileStatus();
  }

  private checkMobileStatus(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile && this.isOpen) {
      this.isOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  hideSidebarOnMobile(): void {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }
}
