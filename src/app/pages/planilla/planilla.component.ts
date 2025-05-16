import { Component, OnInit } from '@angular/core';
import { Planilla } from '../../model/planilla';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { PlanillaService } from '../../services/planilla.service';
import { Persona } from '../../model/persona';
import { TempPlanilla } from '../../model/tempPlanilla';
import { TempPlanillaService } from '../../services/temp-planilla.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-planilla',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule,ConfirmDialogModule],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './planilla.component.html',
  styleUrl: './planilla.component.css'
})
export class PlanillaComponent implements OnInit{
  
  planillaTemp!: TempPlanilla[]
  persona! : Persona[]
  planilla!: Planilla[]
  visible: boolean = false;
  
 // Variable para controlar si el primer paso se ha completado
 step1Completed: boolean = false;

 // Esta variable controla el paso activo
 activeIndex: number = 0;


  constructor(
    private planillaService: PlanillaService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private tempPlanillaService: TempPlanillaService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ){}
  ngOnInit(): void {

    this.planillaService.findAll().subscribe(data =>
    {
      this.planilla = data
    });


    this.tempPlanillaService.findAll().subscribe(data=>{
      this.planillaTemp = data
    })

  }
  updateTable(){
    this.tempPlanillaService.findAll().subscribe(data=>{
      this.planillaTemp = data
    })
  }
  updateTablePlanilla(){
    this.planillaService.findAll().subscribe(data =>
      {
        this.planilla = data
      });
  }
  
  showDialog(){
    
    this.visible = true;
    
    
  }
  delete(){
    
  }
  registrarTempPlanilla(){


  }

  personalNuevo(){
    this.tempPlanillaService.findAll().subscribe(data=>{
      
    })
  }

  /* insertProcedure(){
    this.personalNuevo()
    for(let i = 0; i<1;i++){
      this.tempPlanillaService.insertarTempPlaniia().subscribe(data=>{
        console.log(data);
      })
    }
    window.location.reload();
    window.location.reload();
  } */

    insertProcedure() {
      this.tempPlanillaService.insertarTempPlaniia().subscribe({
        next: () => {
          this.messageService.add({ severity: 'info', summary: 'ACTUALIZACION', detail: 'Actualizado Correctamente', life: 3000 });
          this.updateTable()
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo insertar la planilla'
          });
        },
        complete: () => {
          console.log("✔️ Procedimiento de inserción completado.");
        }
      });
    }

  confirm2() {
    this.confirmationService.confirm({
        header: 'Confirmacion',
        message: 'Por favor revise los datos, una vez registrado ya no se podra tener cambios.',
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        rejectButtonStyleClass: 'p-button-sm',
        acceptButtonStyleClass: 'p-button-outlined p-button-sm',
        accept: () => {
            this.callPlanilla();
            this.messageService.add({ severity: 'info', summary: 'Confirmar', detail: 'Registrado', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelar', detail: 'Cancelado', life: 3000 });
        }
    });
}

callPlanilla(){
  this.planillaService.callPlanilla().subscribe({
    next:(data)=>{
      this.updateTablePlanilla();
    },
    error:(e)=>{
      
    },
    complete:()=>{
      
    }

  })
}


 // Método que se llama cuando se confirma el primer paso
 onCompleteStep1() {
   this.step1Completed = true;
   this.activeIndex = 1; // Cambia al siguiente paso si el primero está completado
 }

 // Método para ir al paso 1 (cuando se hace clic en el primer paso)
 onActiveIndexChange(event: any) {
   if (event === 1 && !this.step1Completed) {
     // Si el paso 1 no está completado, no permitir cambiar al paso 2
     this.activeIndex = 0;
   }
 }

}
