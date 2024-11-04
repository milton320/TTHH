import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { PermisoDialogComponent } from './permiso-dialog/permiso-dialog.component';
import { Permiso } from '../../model/permiso';
import { PermisoService } from '../../services/permiso.service';
import { switchMap } from 'rxjs';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-permiso',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule,RouterOutlet,RouterLink ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './permiso.component.html',
  styleUrl: './permiso.component.css'
})
export class PermisoComponent implements OnInit {
  permiso!: Permiso[]

  //loading: boolean = true;
  ref: DynamicDialogRef 
  constructor(
    private personaService: PersonaService,
    private permisoService: PermisoService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
    ){}

    ngOnInit(): void 
    {  
      this.permisoService.findAll().subscribe(data =>
      {
        this.permiso = data
      });
  
      this.permisoService.getMessageChange().subscribe(data=>
      {
        console.log(data);
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
        }
      
      })        
    }
    updateTable(){
      this.permisoService.findAll().subscribe(data => {
        this.permiso = data
      });
    }
    
    showDialog(permiso?: Permiso){
      if(permiso == null){
        this.ref = this.dialogService.open(PermisoDialogComponent, {
          header: 'PERMISO ',
          data: permiso,
          modal:true,
          width: '35vw',
          maximizable:true,
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        })  
      
      }else{
        this.ref = this.dialogService.open(PermisoDialogComponent, {
          header: 'ACTUALIZAR PERMISO',
          data: permiso,
          modal:true
        })  
      }
    }
    confirm2(event: Event, idPermiso:any) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Quieres Elminar este registro?',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
              console.log(idPermiso);
              this.delete(idPermiso)
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
          }
      });
    }
    delete(idPermiso:any){
      this.permisoService.delete(idPermiso)
      .pipe(switchMap(()=>this.permisoService.findAll()))
      .subscribe(data=>{
        this.permisoService.setPermisoChange(data);
        this.permisoService.setMessageChange('DELETE!');
      })
    }
 

}
