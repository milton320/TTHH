import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MenuService } from '../../services/menu.service';
import { PrimeNGConfig } from 'primeng/api';
import { NgFor, NgIf } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { CardModule } from 'primeng/card';
import { LoginService } from '../../services/login.service';
import { InfoPersona } from '../../model/infoPersona';
import { TempPlanillaService } from '../../services/temp-planilla.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { PersonaService } from '../../services/persona.service';
import { SucursalService } from '../../services/sucursal.service';
import { TiempoHMPipe } from '../../pipes/tiempo-hm.pipe'; // Ajusta la ruta según tu proyecto

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, MaterialModule,CardModule,TiempoHMPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  username: string
  role: string
  idPersona: number
  es: any;
  infoPersona!:InfoPersona
  cantidadFalta:any
  cantidadAtraso:any
  sucursalPersona:any
  cantidadContrato:any
  cantidadGenero:any

  constructor(private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    private loginService: LoginService,
    private tempPlanillaService: TempPlanillaService,
    private tipoContratoService: TipoContratoService,
    private personaService: PersonaService,
    private sucursalService: SucursalService

  ){
  }

  ngOnInit(){
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.role = decodedToken.role;
    this.idPersona = decodedToken.idPersona;

    
    this.loginService.userInformacion(this.username).subscribe(data=>{
      this.infoPersona = data[0];
       
    })

    this.tempPlanillaService.getCantidadFaltas().subscribe(data=>{
      
      this.cantidadFalta = data;
    })

    this.tempPlanillaService.getCantidadAtraso().subscribe(data=>{
      
      this.cantidadAtraso = data;
      
    })

    this.sucursalService.cantidaPersonalSucursal().subscribe(data=>{
      this.sucursalPersona = data;
    })

    this.tipoContratoService.getCantidadContratos().subscribe(data=>{
      this.cantidadContrato = data;
    })

    this.personaService.cantidadGenero().subscribe(data=>{
      this.cantidadGenero = data;
    })



    

    this.menuService.getMenuByUser(this.username).subscribe(data=>this.menuService.setMenuChange(data));

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    }
    this.primengConfig.setTranslation(this.es)
  }

}
