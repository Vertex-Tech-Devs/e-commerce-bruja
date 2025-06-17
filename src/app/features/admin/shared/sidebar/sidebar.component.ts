import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {

  isOpen: boolean = false;

  constructor() { }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
  }

}
