import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DietaService } from '../../services/dieta.service';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { Dieta } from '../../model/dieta';
import { DietaDialogComponent } from './dieta-dialog/dieta-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-dieta',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './dieta.component.html',
  styleUrl: './dieta.component.css'
})
export class DietaComponent implements OnInit {
  dieta!: Dieta[]
  loading: boolean = true;
  ref: DynamicDialogRef

  constructor(
    private dietaService: DietaService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ){}

  ngOnInit(): void 
  {  
    this.dietaService.findAll().subscribe(data =>
    {
      this.dieta = data
    });

    this.dietaService.getMessageChange().subscribe(data=>
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
      }
    
    })        
  }
  updateTable(){
    this.dietaService.findAll().subscribe(data => {
      this.dieta = data
    });
  }
  
  showDialog(dieta?: Dieta){
    this.ref = this.dialogService.open(DietaDialogComponent, {
      header: 'DIETA',
      data: dieta,
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
            
            this.delete(idDieta)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  }
  delete(idDieta:any){
    this.dietaService.delete(idDieta)
    .pipe(switchMap(()=>this.dietaService.findAll()))
    .subscribe(data=>{
      this.dietaService.setDietaChange(data);
      this.dietaService.setMessageChange('DELETE!');

    })
  }
  

}
