import { Component, OnInit } from '@angular/core';
import { BonoAntiguedad } from '../../model/bonoAntiguedad';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BonoAntiguedadService } from '../../services/bono-antiguedad.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BonoDialogComponent } from './bono-dialog/bono-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-bono-antiguedad',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './bono-antiguedad.component.html',
  styleUrl: './bono-antiguedad.component.css'
})
export class BonoAntiguedadComponent  implements OnInit{
  bono!: BonoAntiguedad[];
  ref: DynamicDialogRef


  constructor(
    private bonoAntiguedadService: BonoAntiguedadService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){

  }  
  
  ngOnInit(): void {
    this.bonoAntiguedadService.findAll().subscribe(data=>{
      this.bono = data;
    });

    this.bonoAntiguedadService.getMessageChange().subscribe(data=>
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
    this.bonoAntiguedadService.findAll().subscribe(data => {
      this.bono = data
    });
  }
  showDialog(bono?: BonoAntiguedad){
    this.ref = this.dialogService.open(BonoDialogComponent, {
      header: 'BONO ANTIGUEDAD',
      data: bono,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }

  delete(idAnticipo:any){
    this.bonoAntiguedadService.delete(idAnticipo)
    .pipe(switchMap(()=>this.bonoAntiguedadService.findAll()))
    .subscribe(data=>{
      this.bonoAntiguedadService.setBonoAntiguedadChange(data);
      this.bonoAntiguedadService.setMessageChange('DELETE!');
    })
  }

}
