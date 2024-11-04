import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from '../../material/material.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Prestamo } from '../../model/prestamo';
import { PrestamoService } from '../../services/prestamo.service';
import { Persona } from '../../model/persona';
import { PrestamoDialogComponent } from './prestamo-dialog/prestamo-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.css'
})
export class PrestamoComponent {
  prestamo!: Prestamo[]
  loading: boolean = true;
  ref: DynamicDialogRef

  constructor(
    private prestamoService: PrestamoService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ){}

  ngOnInit(): void 
  {  
    this.prestamoService.findAll().subscribe(data =>
    {
      this.prestamo = data
    });

    this.prestamoService.getMessageChange().subscribe(data=>
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
    this.prestamoService.findAll().subscribe(data => {
      this.prestamo = data
    });
  }

  showDialog(anticipo?: Persona){
    this.ref = this.dialogService.open(PrestamoDialogComponent, {
      header: 'PRESTAMOS',
      data: anticipo,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }
  
  confirm2(event: Event, idPrestamo:any) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Elminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
            console.log(idPrestamo);
            this.delete(idPrestamo)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  } 
  delete(idPrestamo:any){
    this.prestamoService.delete(idPrestamo)
    .pipe(switchMap(()=>this.prestamoService.findAll()))
    .subscribe(data=>{
      this.prestamoService.setPrestamoChange(data);
      this.prestamoService.setMessageChange('DELETE!');
    })
  }
  
}
