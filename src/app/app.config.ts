import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';
import { ServerErrorsInterceptor } from './interceptor/server-errors.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME)
}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    //provideHttpClient()
    importProvidersFrom(
      JwtModule.forRoot({
        config:{
          tokenGetter:tokenGetter,
          allowedDomains:["localhost:8080"],
          disallowedRoutes:["http://localhost:8080/login/forget"]
          //allowedDomains:["192.168.100.29:8080"],
          //disallowedRoutes:["http://192.168.100.29:8080/rrhh-backend/login/forget"]
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()), //para peticiones HTTP - Forma cuabndo el viaje el token jwt
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    } */
   /* {
    provide:LocationStrategy,useClass:HashLocationStrategy
   } */


  ]
};
