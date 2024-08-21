import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../services/login.service";
import { inject } from "@angular/core";
import { MenuService } from "../services/menu.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment.development";

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

    return true
   

}