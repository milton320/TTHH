import { Routes } from '@angular/router';
import { MainComponent } from './pages/layout/main/main.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { SucursalComponent } from './pages/sucursal/sucursal.component';
import { SucursalDialogComponent } from './pages/sucursal/sucursal-dialog/sucursal-dialog.component';
import { AnticipoComponent } from './pages/anticipo/anticipo.component';
import { AtrasoComponent } from './pages/atraso/atraso.component';
import { DietaComponent } from './pages/dieta/dieta.component';
import { FaltaComponent } from './pages/falta/falta.component';
import { JustificativoFaltaComponent } from './pages/justificativo-falta/justificativo-falta.component';
import { JustificativoAtrasoComponent } from './pages/justificativo-atraso/justificativo-atraso.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { PlanillaComponent } from './pages/planilla/planilla.component';
import { PrestamoComponent } from './pages/prestamo/prestamo.component';
import { VacacionComponent } from './pages/vacacion/vacacion.component';
import { PermisoEditComponent } from './pages/permiso/permiso-edit/permiso-edit.component';

export const routes: Routes = [
  { 
    path:'pages', 
    component: MainComponent,
    loadChildren:()=>import('./pages/pages.routes').then(x=>x.pagesRoutes) 
  }
  
      
];
