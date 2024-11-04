import { Component, OnInit } from '@angular/core';
import { Atraso } from '../../model/atraso';
import { AtrasoService } from '../../services/atraso.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { JustificativoAtrasoService } from '../../services/justificativo-atraso.service';
import { forkJoin, switchMap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-atraso',
  standalone: true,
  imports: [MaterialModule,CommonModule,InputTextModule,ButtonModule,InputTextareaModule, FormsModule,ToastModule],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './atraso.component.html',
  styleUrl: './atraso.component.css'
})
export class AtrasoComponent implements OnInit{
  atraso!:Atraso[];
  atraso2:Atraso
  loading:Boolean

  
  constructor(
    private atrasoService: AtrasoService,
    private justificativoAtrasoService:JustificativoAtrasoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}
  ngOnInit(): void {
    
    this.atrasoService.findAll().subscribe(
      {
        next: (data) => this.atraso = data,
        error: (e) => {
          this.atrasoService.setMessageChange('ERROR!'), this.loading=false
        },
        complete: () =>{
          this.atrasoService.setMessageChange('LOAD!')
          this.loading=true
        } 
      }
    //   result=>console.log(result),
    //   error=>{
    //       this.atrasoService.setMessageChange('ERROR!');
    // }
  )
    
    this.atrasoService.getMessageChange().subscribe(data=>{
      if(data == 'CREATED')
        {
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'UPDATE!')
        {
          this.messageService.add({ severity: 'info', summary: 'ACTUALIZADO', detail: 'Actualizado Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'DELETE!'){
          this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'ERROR!'){
          this.messageService.add({ severity: 'warn', summary: 'ATENCION', detail: 'Error de Conexion' });
          /* this.updateTable() */
        }
        else if(data == 'LOAD!'){
          this.messageService.add({ severity: 'contrast', summary: 'CARGA DE DATOS', detail: 'Carga de datos correctamente' });
          /* this.updateTable() */
        }

    })
  }

  updateTable(){
    this.atrasoService.findAll().subscribe(
      {
        next: (data) => this.atraso = data,
        error: (e) => this.atrasoService.setMessageChange('ERROR!'),
        complete: () => this.atrasoService.setMessageChange('LOAD!')
      }
    )
  }
  ngOnChange(){
    this.atraso2 = {...this.atraso2}
  }

  registrrarAtrasos() {
    // Crear una lista de observables de las solicitudes de guardado
    const saveObservables = this.atraso.map(element => 
      this.atrasoService
        .saveOtherAtraso(element)
        .pipe(switchMap(() => this.atrasoService.findAllOtherAtraso()))
    );
  
    // Ejecutar todas las solicitudes en paralelo y esperar a que todas terminen
    forkJoin(saveObservables).subscribe({
      next: (responses) => {
        // `responses` contiene todos los resultados de las solicitudes
        console.log(responses);
        this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
      },
      error: (error) => {
        // Manejo de errores si alguna de las solicitudes falla
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Ocurrió un error al registrar los atrasos' });
        console.error(error);
      }
    });
  }

  
  insertar(){
    this.atrasoService.saveExterno()
    .pipe(switchMap(()=>this.atrasoService.findAllOtherAtraso()))
      .subscribe(data=>{
        console.log(data);
      })

  }
 /*  confirm2(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Elminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
            
            
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  } */
  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Verifique los datos antes de continuar.',
        icon: 'pi pi-exclamation-circle',
        acceptIcon: 'pi pi-check mr-1',
        rejectIcon: 'pi pi-times mr-1',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'p-button-outlined p-button-sm',
        acceptButtonStyleClass: 'p-button-sm',
        accept: () => {
            //this.messageService.add({ severity: 'info', summary: 'Confirmar', detail: 'aceptado', life: 3000 });
            this.registrrarAtrasos()
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Rechazado', life: 3000 });
        }
    });
  }
}
