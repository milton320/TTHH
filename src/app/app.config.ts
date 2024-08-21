import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';

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
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi())

  ]
};
