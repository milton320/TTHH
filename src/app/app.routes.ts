import { Routes } from '@angular/router';
import { MainComponent } from './pages/layout/main/main.component';

import { LoginComponent } from './login/login.component';
import { Not404Component } from './pages/not-404/not-404.component';



export const routes: Routes = [
  {
    path:'', component:LoginComponent
  },
  {
    path:'login', component:LoginComponent
  },
  { 
    path:'pages', 
    component: MainComponent,
    loadChildren:()=>import('./pages/pages.routes').then(x=>x.pagesRoutes) 
  },
  {
    path:'not-404', component:Not404Component
  },
  {
    path:'**', redirectTo: 'not-404'
  }

  
      
];
