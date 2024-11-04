import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SucursalService } from '../../services/sucursal.service';
import { Sucursal } from '../../model/sucursal';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { SucursalDialogComponent } from './sucursal-dialog/sucursal-dialog.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { switchMap } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,ToastModule,RippleModule],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css',
  
})
export class SucursalComponent  implements OnInit{
  username: string

  sucursal!: Sucursal[];
  loading: boolean = true;
  ref: DynamicDialogRef 

  constructor(
      private sucursalService: SucursalService,
      private _dialog :DialogModule,
      public dialogService: DialogService,
      private messageService: MessageService,
      private menuService: MenuService,
      private confirmationService: ConfirmationService
  ){}

  ngOnInit(): void {
    /*** USUARIO  */
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;

    this.menuService.getMenuByUser(this.username).subscribe(data=>this.menuService.setMenuChange(data)); 
    
    /***FON */


    this.sucursalService.findAll().subscribe(data => {
      this.sucursal = data
    });

    this.sucursalService.getMessageChange().subscribe(data=>{
      console.log(data);
      if(data == 'CREATED'){
        this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
        this.updateTable()
      }
      else if(data == 'UPDATE!'){
        this.messageService.add({ severity: 'info', summary: 'ACTUALIZADO', detail: 'Actualizado Correctamente' });
        this.updateTable()
      }
      else if(data == 'DELETE!'){
        this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
        this.updateTable()
      }
      
    })
  
  } 
  updateTable(){
    this.sucursalService.findAll().subscribe(data => {
      this.sucursal = data
    });
  }
  applyFilter(event: any){
    console.log(event)

  }
  openDialog(){
    console.log('save');
  }

  visible: boolean = false;

  showDialog(sucursal?: Sucursal) {
    this.ref = this.dialogService.open(SucursalDialogComponent, {
      header: 'SUCURSALES',
      data: sucursal,
      modal:true
  });
  
  }

  confirm2(event: Event, idPrestamo:any) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Elminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
            console.log(idPrestamo);
            this.delete(idPrestamo)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  }
  delete(idSucursal:any){
    this.sucursalService.delete(idSucursal)
    .pipe(switchMap(()=>this.sucursalService.findAll()))
    .subscribe(data=>{
      this.sucursalService.setSucursalChange(data);
      this.sucursalService.setMessageChange('DELETE!');

    })
  }

}
