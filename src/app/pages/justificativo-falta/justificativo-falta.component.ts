import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from '../../material/material.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JustificativoFalta } from '../../model/justificativoFalta';
import { FaltaService } from '../../services/falta.service';
import { DialogModule } from 'primeng/dialog';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { JfaltaDialogComponent } from './jfalta-dialog/jfalta-dialog.component';

interface MesAnio{
  mes:string,
  cod:number
}

@Component({
  selector: 'app-justificativo-falta',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,ToastModule,RippleModule,ReactiveFormsModule],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './justificativo-falta.component.html',
  styleUrl: './justificativo-falta.component.css'
})
export class JustificativoFaltaComponent implements OnInit{
  mesAnios:MesAnio[] | undefined; 
  resultado:number;
  selectedMeses: any | undefined;
  justFalta!: JustificativoFalta[];
  ref: DynamicDialogRef;
  formGroup: FormGroup | undefined;
  
  
  
  constructor(
    private justificativoService: FaltaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService

  ){}

  ngOnInit(): void {
    this.mesAnios = [
      { mes: 'ENERO', cod: 1 },
      { mes: 'FEBRERO', cod: 2 },
      { mes: 'MARZO', cod: 3 },
      { mes: 'ABRIL', cod: 4 },
      { mes: 'MAYO', cod: 5 },
      { mes: 'JUNIO', cod: 6 },
      { mes: 'JULIO', cod: 7 },
      { mes: 'AGOSTO', cod: 8 },
      { mes: 'SEPTIEMBRE', cod: 9 },
      { mes: 'OCTUBRE', cod: 10 },
      { mes: 'NOVIEMBRE', cod: 11 },
      { mes: 'DICIEMBRE', cod: 12 }
    ];
    this.justificativoService.findAll().subscribe(data=>{
      this.justFalta = data
      console.log(data);
    })
    this.formGroup = new FormGroup({
      selectedMeses: new FormControl<MesAnio | null>(null),
    });
    this.justificativoService.getMessageChange().subscribe(data=>
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
    this.justificativoService.findAll().subscribe(data => {
      this.justFalta = data
    });
  }

  showDialog(justFalta?: JustificativoFalta){
    this.ref = this.dialogService.open(JfaltaDialogComponent, {
      header: 'JUSTIFICADO FALTA',
      data: justFalta,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }
  delete(idAtraso:any){

  }
  meses(){
    this.justificativoService.mesesAnios(8,2024)
    .pipe(switchMap(()=>this.justificativoService.findAll()))
    .subscribe(
      data =>{
          console.log(data);
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
      }
    )

    
  }

  calcularAtrasos(){
    
  }
  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Verifique los datos de AÑO y MES',
        icon: 'pi pi-exclamation-circle',
        acceptIcon: 'pi pi-check mr-1',
        rejectIcon: 'pi pi-times mr-1',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'p-button-outlined p-button-sm',
        acceptButtonStyleClass: 'p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmar', detail: 'aceptado', life: 3000 });
            this.operate()
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Rechazado', life: 3000 });
        }
    });
    
  }
  operate() {
    /* let { mes, cod } = mesRe; */
    let mesResta

    mesResta = moment().format('MM')
    let anio =moment().format('YYYY');
    
    console.log(parseInt(mesResta)-2, parseInt(anio));
    this.justificativoService.mesesAnios(parseInt(mesResta)-2, parseInt(anio))
    .pipe(switchMap(()=>this.justificativoService.findAll()))
    .subscribe(
      data =>{
          console.log(data);
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
      }
    )
  }

  

}
