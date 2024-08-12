import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JusAtraso } from '../../model/jusAtraso';
import { JustificativoAtrasoService } from '../../services/justificativo-atraso.service';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { JatrasoDialogComponent } from './jatraso-dialog/jatraso-dialog.component';

@Component({
  selector: 'app-justificativo-atraso',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService],
  templateUrl: './justificativo-atraso.component.html',
  styleUrl: './justificativo-atraso.component.css'
})
export class JustificativoAtrasoComponent implements OnInit{
  justAtraso!: JusAtraso[];
  ref: DynamicDialogRef

  constructor(
    private justAtrasoService:JustificativoAtrasoService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService
    ) {}

  ngOnInit(){
    this.justAtrasoService.findAll().subscribe(data=>{
      this.justAtraso = data;
    });

    this.justAtrasoService.getMessageChange().subscribe(data=>
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
    this.justAtrasoService.findAll().subscribe(data => {
      this.justAtraso = data
    });
  }
  showDialog(jusAtraso?:JusAtraso){
    this.ref = this.dialogService.open(JatrasoDialogComponent, {
      header: 'DETALLE JUSTIFICATIVO',
      data: jusAtraso,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }
  delete(id:number){

  }
}
