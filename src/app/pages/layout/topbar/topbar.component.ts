import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppLayoutService } from '../../../services/app.layout.service';
import { LoginService } from '../../../services/login.service';
import { MaterialModule } from '../../../material/material.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment.development';
import { InfoPersona } from '../../../model/infoPersona';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MaterialModule,CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  providers: [AppLayoutService]
})
export class TopbarComponent implements OnInit {
  items!: MenuItem[];
  username: string
  role: string
  infoPersona!:InfoPersona
  

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: AppLayoutService,
    private loginService:LoginService,

  ) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    
    this.username = decodedToken.sub;
    this.role = decodedToken.role;

    this.loginService.userInformacion(this.username).subscribe(data=>{
      this.infoPersona = data[0];
      
    })
  }

  logout(){
    this.loginService.logout();
  }

  perfil(){
    
  }

}