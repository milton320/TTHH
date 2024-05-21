import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Vacacion } from '../../model/vacacion';
import { VacacionService } from '../../services/vacacion.service';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { VacacionDialogComponent } from './vacacion-dialog/vacacion-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-vacacion',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule  ],
  providers: [DialogService,DynamicDialogRef,MessageService],
  templateUrl: './vacacion.component.html',
  styleUrl: './vacacion.component.css'
})
export class VacacionComponent {
  vacacion!: Vacacion[]
  loading: boolean = true;
  ref: DynamicDialogRef
  
  constructor(
    private vacacionService: VacacionService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService
    ){}

  ngOnInit(): void 
  {  
    this.vacacionService.findAll().subscribe(data =>
    {
      this.vacacion = data
    });

    this.vacacionService.getMessageChange().subscribe(data=>
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
      else if(data == 'DELETE!'){
        this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
        this.updateTable()
      }
    
    })        
  }
  updateTable(){
    this.vacacionService.findAll().subscribe(data => {
      this.vacacion = data
    });
  }
  showDialog(vacacion?: Vacacion){
    this.ref = this.dialogService.open(VacacionDialogComponent, {
      header: 'VACACION',
      data: vacacion,
      modal:true
    })  
  }

  delete(idVacacion:any){
    this.vacacionService.delete(idVacacion)
    .pipe(switchMap(()=>this.vacacionService.findAll()))
    .subscribe(data=>{
      this.vacacionService.setVacionChange(data);
      this.vacacionService.setMessageChange('DELETE!');

    })
  }

}
