import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../services/login.service";
import { inject } from "@angular/core";
import { MenuService } from "../services/menu.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment.development";
import { map } from "rxjs";
import { Menu } from "../model/menu";

export const cetGuard=(route: ActivatedRouteSnapshot, state:RouterStateSnapshot)=>{

    const loginService = inject(LoginService);
    const menuService = inject(MenuService);
    const router = inject(Router)
    //1) verificar si el usuario esta logueado
    const rpta = loginService.islogged();
    if(!rpta){
        loginService.logout();
        return false;
    }
    //2) verificar si el token no ha expirado
    const helper = new JwtHelperService();
    const token =  sessionStorage.getItem(environment.TOKEN_NAME);

    if(!helper.isTokenExpired(token)){
        //3) verificar si tienes el rol necesario para accesder a ese componente 'PAGINA'
        const url = state.url;
        const decodedToken = helper.decodeToken(token);
        const username = decodedToken.sub;

        return menuService.getMenuByUser(username).pipe( map( (data: Menu[])=> {
            menuService.setMenuChange(data);

            let count = 0;
            for(let m of data)            {
                if(url.startsWith(m.url)){
                    count++;
                    break;
                }
            }

            if(count > 0){
                return true;
            }else{
                router.navigate(['/pages/not-403']);
                return false;
            }
        }));
        
    }
    else{
        loginService.logout();
        return false
    }    



}