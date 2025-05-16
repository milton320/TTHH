import { Component } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
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
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './vacacion.component.html',
  styleUrl: './vacacion.component.css'
})
export class VacacionComponent {
  vacacion!: Vacacion[]
  loading: boolean = true;
  ref: DynamicDialogRef
  es: any;
  constructor(
    private vacacionService: VacacionService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig
    ){}

  ngOnInit(): void 
  {  
    this.vacacionService.findAll().subscribe(data =>
    {
      this.vacacion = data
    });

    this.vacacionService.getMessageChange().subscribe(data=>
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
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    }
    this.primengConfig.setTranslation(this.es)      
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
      modal:true,
      maximizable:true
    })  
  }
  confirm2(event: Event, idVacacion:any, vacacion) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Elminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminado correctamente', life: 3000 });
            this.eliminarLogica(idVacacion, vacacion)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  }
/*   delete(idVacacion:any){
    this.vacacionService.delete(idVacacion)
    .pipe(switchMap(()=>this.vacacionService.findAll()))
    .subscribe(data=>{
      this.vacacionService.setVacionChange(data);
      this.vacacionService.setMessageChange('DELETE!');

    })
  } */
    // Método para eliminar vacación de manera lógica (opcional)
    eliminarLogica(idVacacion: any, vacacion: any){
      this.vacacionService.deleteLogic(idVacacion, vacacion)
      .pipe(switchMap(()=>this.vacacionService.findAll()))
      .subscribe(data=>{
        console.log(data);
        this.vacacionService.setVacionChange(data);
        this.vacacionService.setMessageChange('DELETE!');
  
      })
    }

}
