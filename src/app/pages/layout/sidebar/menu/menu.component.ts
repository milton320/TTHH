import { Component, OnInit } from '@angular/core';

import { MenuItemComponent } from '../menu-item/menu-item.component';
import { CommonModule } from '@angular/common';
import { AppLayoutService } from '../../../../services/app.layout.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent, CommonModule],
  templateUrl: './menu.component.html',
  providers: [AppLayoutService]
})
export class MenuComponent implements OnInit{
  model: any[] = [];

  constructor(public layoutService: AppLayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Opciones',
        items: [
          {
            label: 'Personal',
            icon: 'pi pi-fw pi-id-card',
            routerLink: ['/pages/personal'],
          },
          {
            label: 'Sucursal',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/sucursal'],
          },
          {
            label: 'Anticipo',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/anticipo'],
          },
          {
            label: 'Dieta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/dieta'],
          },
          {
            label: 'Atraso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/atraso'],
          },
          
          {
            label: 'Falta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/falta'],
          },
          {
            label: 'Justificativo Atraso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/justificativo'],
          },
          {
            label: 'Justificativo Falta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/justificativoFalta'],
          },
          {
            label: 'Permiso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/permiso'],
          },
          {
            label: 'Planilla',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/planilla'],
          },
          {
            label: 'Prestamo',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/prestamo'],
          },
          {
            label: 'Vacacion',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/pages/vacacion'],
          },
          {
            label: 'Reportes',
            icon: 'pi pi-fw pi-file',
            routerLink: ['/pages/report'],
          }
        ],
      },

    ];
  }
}