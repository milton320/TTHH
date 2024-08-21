import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppLayoutService } from '../../../services/app.layout.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  providers: [AppLayoutService]
})
export class TopbarComponent {
  items!: MenuItem[];
  

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: AppLayoutService,
    private loginService:LoginService

  ) {}

  logout(){
    this.loginService.logout();
  }

}