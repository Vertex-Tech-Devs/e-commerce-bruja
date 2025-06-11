import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
