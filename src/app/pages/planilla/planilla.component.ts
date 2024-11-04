import { Component, OnInit } from '@angular/core';
import { Planilla } from '../../model/planilla';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
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


  constructor(
    private planillaService: PlanillaService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private tempPlanillaService: TempPlanillaService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ){

  }
  
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
    
  }
  
  showDialog(){
    
    this.visible = true;
    
    
  }
  delete(){
    
  }
  registrarTempPlanilla(){
    console.log('REGISTRO EXITOSO')

  }

  personalNuevo(){
    this.tempPlanillaService.findAll().subscribe(data=>{
      console.log(data);
    })
  }

  insertProcedure(){
    this.personalNuevo()
    for(let i = 0; i<2;i++){
      this.tempPlanillaService.insertarTempPlaniia().subscribe(data=>{
        console.log(data);
      })
    }
    window.location.reload();
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
            this.messageService.add({ severity: 'info', summary: 'Confirmar', detail: 'Registrado', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelar', detail: 'Cancelado', life: 3000 });
        }
    });
}

}
