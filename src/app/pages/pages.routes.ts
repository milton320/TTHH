import { Routes } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { SucursalDialogComponent } from './sucursal/sucursal-dialog/sucursal-dialog.component';
import { AnticipoComponent } from './anticipo/anticipo.component';
import { AtrasoComponent } from './atraso/atraso.component';
import { DietaComponent } from './dieta/dieta.component';
import { FaltaComponent } from './falta/falta.component';
import { JustificativoAtrasoComponent } from './justificativo-atraso/justificativo-atraso.component';
import { JustificativoFaltaComponent } from './justificativo-falta/justificativo-falta.component';
import { PermisoComponent } from './permiso/permiso.component';
import { PermisoEditComponent } from './permiso/permiso-edit/permiso-edit.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PrestamoComponent } from './prestamo/prestamo.component';
import { VacacionComponent } from './vacacion/vacacion.component';
import { MainComponent } from './layout/main/main.component';
import { PersonalEditComponent } from './personal/personal-edit/personal-edit.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { cetGuard } from '../guard/cert.guard';




export const pagesRoutes: Routes = [
      { path: 'dashboard',component: DashboardComponent, canActivate: [cetGuard] },
      { path: 'personal', component:PersonalComponent,
        children:[
          {
            path:'new', component:PersonalEditComponent,
          },
          {
            path:'edit/:id', component:PersonalEditComponent,
          }
        ],canActivate: [cetGuard]
       },
      { path: 'sucursal', component:SucursalComponent,
        children:[
            { path: 'new', component:SucursalDialogComponent }
          ],canActivate: [cetGuard]
      },
      { path: 'anticipo', component:AnticipoComponent ,canActivate: [cetGuard]},
      { path: 'atraso', component:AtrasoComponent, canActivate: [cetGuard]},
      { path: 'dieta', component:DietaComponent, canActivate: [cetGuard]},
      { path: 'falta', component:FaltaComponent,canActivate: [cetGuard]},
      { path: 'justificativo', component:JustificativoAtrasoComponent, canActivate: [cetGuard]},
      { path: 'justificativoFalta', component:JustificativoFaltaComponent, canActivate: [cetGuard]},
      { path: 'permiso', component:PermisoComponent,
        children:[
          { path: 'new', component:PermisoEditComponent},
          { path: 'edit/:id', component:PermisoEditComponent}
        ], canActivate: [cetGuard]
      },
      { path: 'planilla', component:PlanillaComponent, canActivate: [cetGuard]},
      { path: 'prestamo', component:PrestamoComponent, canActivate: [cetGuard]},
      { path: 'vacacion', component:VacacionComponent, canActivate: [cetGuard]},
      { path: 'report', component:ReportComponent, canActivate: [cetGuard]}

      
];
