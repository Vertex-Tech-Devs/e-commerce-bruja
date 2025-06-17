import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent,SidebarComponent,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
