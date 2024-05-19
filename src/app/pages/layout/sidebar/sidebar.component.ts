import { Component, ElementRef, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { AppLayoutService } from '../../../services/app.layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  providers: [AppLayoutService]
})
export class SidebarComponent {
  constructor(public layoutService: AppLayoutService, public el: ElementRef) {}
}