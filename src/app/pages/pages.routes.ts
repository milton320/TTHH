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



export const pagesRoutes: Routes = [
  
      { path: 'personal', component:PersonalComponent,
        children:[
          {
            path:'new', component:PersonalEditComponent,
          },
          {
            path:'edit/:id', component:PersonalEditComponent,
          }
        ]
       },
      { path: 'sucursal', component:SucursalComponent,
        children:[
            { path: 'new', component:SucursalDialogComponent }
          ] 
      },
      { path: 'anticipo', component:AnticipoComponent},
      { path: 'atraso', component:AtrasoComponent},
      { path: 'dieta', component:DietaComponent},
      { path: 'falta', component:FaltaComponent},
      { path: 'justificativo', component:JustificativoAtrasoComponent},
      { path: 'justificativoFalta', component:JustificativoFaltaComponent},
      { path: 'permiso', component:PermisoComponent,
        children:[
          { path: 'new', component:PermisoEditComponent},
          { path: 'edit/:id', component:PermisoEditComponent}
        ]
      },
      { path: 'planilla', component:PlanillaComponent},
      { path: 'prestamo', component:PrestamoComponent},
      { path: 'vacacion', component:VacacionComponent},

      
];
