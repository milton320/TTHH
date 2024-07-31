import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from '../../material/material.module';
import { Persona } from '../../model/persona';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Anticipo } from '../../model/anticipo';
import { AnticipoService } from '../../services/anticipo.service';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AnticipoDialogComponent } from './anticipo-dialog/anticipo-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-anticipo',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService],
  templateUrl: './anticipo.component.html',
  styleUrl: './anticipo.component.css'
})
export class AnticipoComponent implements OnInit {
  anticipo!: Anticipo[]
  loading: boolean = true;
  ref: DynamicDialogRef

  constructor(
    private anticipoService: AnticipoService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService
    ){}

  ngOnInit(): void 
  {  
    this.anticipoService.findAll().subscribe(data =>
    {
      this.anticipo = data
    });

    this.anticipoService.getMessageChange().subscribe(data=>
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
    this.anticipoService.findAll().subscribe(data => {
      this.anticipo = data
    });
  }
  showDialog(anticipo?: Anticipo){
    this.ref = this.dialogService.open(AnticipoDialogComponent, {
      header: 'ANTICIPOS',
      data: anticipo,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }
  delete(idAnticipo:any){
    this.anticipoService.delete(idAnticipo)
    .pipe(switchMap(()=>this.anticipoService.findAll()))
    .subscribe(data=>{
      this.anticipoService.setAnticipoChange(data);
      this.anticipoService.setMessageChange('DELETE!');
    })
  }
}
