import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { UsurarioModalComponent } from './usurario-modal/usurario-modal.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MaterialModule,CommonModule,InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit{
  usuario!: Usuario[];
  ref: DynamicDialogRef;

  constructor(
    private usuarioService: UsuarioService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  
  ){
    
  }
  
  ngOnInit(): void 
  {
    this.usuarioService.findAllLogin().subscribe(data=>{
      this.usuario = data;
      
    })

    this.usuarioService.getMessageChange().subscribe(data=>
      {
        if(data == 'CREATED')
        {
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
          this.updateTable()
        }
        else if(data == 'UPDATE!')
        {
          this.messageService.add({ severity: 'info', summary: 'ACTUALIZADO', detail: 'Actualizado Correctamente' });
          this.updateTable()
        }
        else if(data == 'DELETE!'){
          this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
          this.updateTable()
        }else if(data == 'ERROR!'){
          this.messageService.add({ severity: 'warn', summary: 'ATENCION', detail: 'Error. Intente nuevamente' });
          this.updateTable()
        }
        else if(data == 'LOAD!'){
          this.messageService.add({ severity: 'secondary', summary: 'CARGA DE DATOS', detail: 'Carga de datos correctamente' });
          this.updateTable()
        }
      
      })      
    
  }
  updateTable(){
    this.usuarioService.findAllLogin().subscribe(data => {
      this.usuario = data
    });
  }

  showDialog(usuario?: Usuario){
    this.ref = this.dialogService.open(UsurarioModalComponent, {
      header: 'USUARIO',
      data: usuario,
      modal:true
    })  
  }
  confirm2(event: Event, idDieta:any) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Elminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
            
            /* this.delete(idDieta) */
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  }

/*   delete(idDieta:any){
    this.dietaService.delete(idDieta)
    .pipe(switchMap(()=>this.dietaService.findAll()))
    .subscribe(data=>{
      this.dietaService.setDietaChange(data);
      this.dietaService.setMessageChange('DELETE!');

    })
  } */
}
