import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sucursal } from '../../../model/sucursal';
import { FormsModule } from '@angular/forms';
import { SucursalService } from '../../../services/sucursal.service';
import { switchMap } from 'rxjs';
import moment from 'moment';
import { Message } from 'primeng/api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-sucursal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './sucursal-dialog.component.html',
  styleUrl: './sucursal-dialog.component.css'
})
export class SucursalDialogComponent implements OnInit {
  username: string;
  role: string;
  idPersona:number;
  
  sucursal: Sucursal;
  messages: Message[] | undefined;

  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private sucursalService: SucursalService
    
  )
  {}

  ngOnInit(): void {
    /*** USUARIO  */
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.role = decodedToken.role;
    this.idPersona = decodedToken.idPersona;
    /***FIN */


    this.sucursal = {...this.config.data}


    if(this.sucursal != null && this.sucursal.idSucursal > 0){
      console.log('')
    }
    else
    {
      this.sucursal.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
    }
  }


  
  /**REGISTRAR ACTUALIZAR */ 
  operate(){
    
    if(this.sucursal !=null && this.sucursal.idSucursal >0 ){
      //UPDATE
      this.sucursal.usuario = this.username;
      this.sucursalService
      .update(this.sucursal.idSucursal, this.sucursal)
      .pipe(switchMap(()=>this.sucursalService.findAll()))
      .subscribe(data=>{
        this.sucursalService.setSucursalChange(data);
        this.sucursalService.setMessageChange("UPDATE!")
      })
    }
    else{
      //INSERT
      if(!this.sucursal.nombre){
        this.messages = [{ severity: 'error', detail: 'LLENAR CAMPOS' }];
        return
      }
      else{
        this.sucursal.usuario = this.username;
        this.sucursalService
        .save(this.sucursal)
        .pipe(switchMap(()=>this.sucursalService.findAll()))
        .subscribe(data=>{
          this.sucursalService.setSucursalChange(data);
          this.sucursalService.setMessageChange('CREATED');
    
        });

      } 
    
    }
    this.close();
  }
  
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  close() {
    this.ref.close();
  }
}
