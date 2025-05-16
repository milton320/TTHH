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
import { concatMap, forkJoin, from, switchMap, tap } from 'rxjs';
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
  isLoading = false; // Variable para controlar el estado del botón
  progressValue = 0; // Control del progreso

  
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

  this.atrasoService.findAllOtherAtraso().subscribe( data =>{
      
    }
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


 /*  //REGISTRAR SERVICIO EXTERNO
  registrrarAtrasos() {
    this.progressValue = 0; // Reiniciar el progreso
    this.isLoading = true; // Deshabilita el botón
    // Crear una lista de observables de las solicitudes de guardado
    const saveObservables = this.atraso.map((element, index) => 
      this.atrasoService
        .saveOtherAtraso(element)
        .pipe(switchMap(() => this.atrasoService.findAllOtherAtraso()),
        // Simular progreso por cada elemento procesado
        switchMap(response => {
          this.progressValue = Math.floor(((index + 1) / this.atraso.length) * 100);
          //this.progressValue = ((index + 1) / this.atraso.length) * 100;
          console.log(this.progressValue + "PRGRESVlues");
          return response;
        })
      )
    );
  
    // Ejecutar todas las solicitudes en paralelo y esperar a que todas terminen
    forkJoin(saveObservables).subscribe({
      next: (responses) => {
        // `responses` contiene todos los resultados de las solicitudes
        this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
      },
      error: (error) => {
        // Manejo de errores si alguna de las solicitudes falla
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Ocurrió un error al registrar los atrasos' });
        
      },
      complete: () => {
        this.isLoading = false; // Habilita el botón cuando todo termine
        this.progressValue = 100; // Completa la barra de progreso
      }
    });
  } */
    registrrarAtrasos() {
      this.progressValue = 0; // Reiniciar el progreso
      this.isLoading = true; // Deshabilita el botón
    
      from(this.atraso).pipe(
        concatMap((element, index) => 
          this.atrasoService.saveOtherAtraso(element).pipe(
            tap(() => {
              // Actualizar progreso después de cada solicitud
              this.progressValue = Math.floor(((index + 1) / this.atraso.length) * 100);
            })
          )
        )
      ).subscribe({
        next: () => {         
        },
        error: (err) => {
          if (err.error && err.error.message) {
            // Si el backend envía un mensaje específico, lo mostramos
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: err.error.message });
          } else {
            // Si no hay un mensaje específico, se muestra un error genérico
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Ocurrió un error al registrar los atrasos' });
          }
        },
        complete: () => {
          this.isLoading = false; // Habilitar botón
          this.progressValue = 100; // Completar barra de progreso
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
        }
      });
    }
    

  
  insertar(){
    this.atrasoService.saveExterno()
    .pipe(switchMap(()=>this.atrasoService.findAllOtherAtraso()))
      .subscribe(data=>{
        
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
