import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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
