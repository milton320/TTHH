import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Persona } from '../../model/persona';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { SucursalService } from '../../services/sucursal.service';
import { MaterialModule } from '../../material/material.module';
import { PersonalDialogComponent } from './personal-dialog/personal-dialog.component';
@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule  ],
  providers: [DialogService,DynamicDialogRef,MessageService],
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
    private messageService: MessageService
    ){}

    ngOnInit(): void 
    {  
      this.personaService.findAll().subscribe(data =>
      {
        this.persona = data
      });
  
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
        modal:true
      })  
    }


}
