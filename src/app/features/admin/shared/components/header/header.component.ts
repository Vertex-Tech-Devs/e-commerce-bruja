import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  userName: string = 'Federico';

  constructor() { }

  ngOnInit(): void {
  }

  onToggleSidebar(event: Event): void {
    event.stopPropagation();
    this.toggleSidebarEvent.emit();
  }

}
