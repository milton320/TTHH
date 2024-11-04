import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Persona } from '../../model/persona';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { SucursalService } from '../../services/sucursal.service';
import { MaterialModule } from '../../material/material.module';
import { PersonalDialogComponent } from './personal-dialog/personal-dialog.component';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { TempPlanillaService } from '../../services/temp-planilla.service';
@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule,RouterOutlet,RouterLink  ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  persona!: Persona[]
  loading: boolean = true;
  ref: DynamicDialogRef 

  constructor(
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private tempPlanillaService:TempPlanillaService,
    private confirmationService: ConfirmationService
    ){}

    ngOnInit(): void 
    {  
      this.personaService.findAll().subscribe(data =>
      {
        this.persona = data
      });
      
      this.personaService.getPersonaChange().subscribe(data=>{
        this.updateTable()
      })
  
      this.personaService.getMessageChange().subscribe(data=>
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
      
      })        
    }
    updateTable(){
      this.personaService.findAll().subscribe(data => {
        this.persona = data
      });
    }
    showDialog(persona?: Persona){
      this.ref = this.dialogService.open(PersonalDialogComponent, {
        header: 'PERSONA',
        data: persona,
        modal:true,
        maximizable:true
      })  
    }

    chekChildren(){
      return this.route.children.length>0;
    }

    
    confirm2(event: Event, idPersona:any) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Quieres Elminar este registro?',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
              console.log(idPersona);
              this.delete(idPersona)
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
          }
      });
    }
    delete(idPersona:any){
      this.personaService.delete(idPersona)
      .pipe(switchMap(()=>this.personaService.findAll()))
      .subscribe(data=>{
        this.personaService.setPersonaChange(data);
        this.personaService.setMessageChange('DELETE!');
      })
    }
}
