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
            routerLink: ['/personal'],
          },
          {
            label: 'Sucursal',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/sucursal'],
          },
          {
            label: 'Anticipo',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/anticipo'],
          },
          {
            label: 'Dieta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/dieta'],
          },
          {
            label: 'Atraso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/atraso'],
          },
          
          {
            label: 'Falta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/falta'],
          },
          {
            label: 'Justificativo Atraso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/justificativo'],
          },
          {
            label: 'Justificativo Falta',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/justificativoFalta'],
          },
          {
            label: 'Permiso',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/permiso'],
          },
          {
            label: 'Planilla',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/planilla'],
          },
          {
            label: 'Prestamo',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/prestamo'],
          },
          {
            label: 'Vacacion',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/vacacion'],
          },
          {
            label: 'Reportes',
            icon: 'pi pi-fw pi-file',
            routerLink: ['/reportes'],
          }
        ],
      },

    ];
  }
}