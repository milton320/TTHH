import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from '../../material/material.module';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JustificativoFalta } from '../../model/justificativoFalta';
import { FaltaService } from '../../services/falta.service';
import { DialogModule } from 'primeng/dialog';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { JfaltaDialogComponent } from './jfalta-dialog/jfalta-dialog.component';
import { AtrasoService } from '../../services/atraso.service';
import { Atraso } from '../../model/atraso';

interface MesAnio{
  mes:string,
  cod:number
}

@Component({
  selector: 'app-justificativo-falta',
  standalone: true,
  imports: [MaterialModule,CommonModule,ToastModule,RippleModule,ReactiveFormsModule,FormsModule],
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
  date:any
  es: any;
  maxMonth: Date;
  astraso: Atraso[];
  mesAtraso:number
  anioAtraso:number
  mesEscrito:String
  
  
  
  constructor(
    private justificativoService: FaltaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private atrasoService: AtrasoService

  ){
    
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
    this.atrasoService.findMesAnioAtraso().subscribe(data =>{
      
      this.astraso = data;
      this.mesAtraso = this.astraso[0].mes;
      this.anioAtraso = this.astraso[0].anio
      this.mesAnios.forEach(element => {
        if(element.cod == this.mesAtraso){
            this.mesEscrito = element.mes
        }
      });
    
    })
    // Obtener el último día del mes actual con Moment.js
    const lastMonth = moment().subtract(1, 'months'); // Obtiene el mes anterior
    this.date = lastMonth.toDate(); // Establece el mes anterior como valor inicial
    this.maxMonth = lastMonth.toDate(); // Restringe la selección al mes anterior
  }

  ngOnInit(): void {
    


    
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

    this.justificativoService.findAll().subscribe(data=>{
      this.justFalta = data

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
/*   meses(){
    this.justificativoService.mesesAnios(8,2024)
    .pipe(switchMap(()=>this.justificativoService.findAll()))
    .subscribe(
      data =>{
          console.log(data);
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
      }
    )

    
  } */

  confirm(event: Event, date: Date) {
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
            this.operate(date)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Rechazado', life: 3000 });
        }
    });
    
  }
  operate(date) {
    
    if(date != null ){
        /* let { mes, cod } = mesRe; *//* 
      const month = moment(date).month() + 1
      const year = moment(date).year() 
      let mesResta
      console.log(month + " " + year);
      
      mesResta = moment().format('MM')
      let anio = moment().format('YYYY'); */
    
      //console.log(parseInt(mesResta)-1, parseInt(anio));
      
      this.justificativoService.mesesAnios(this.mesAtraso, this.anioAtraso)
      
      .pipe(switchMap(()=>this.justificativoService.findAll()))
      .subscribe(
        data =>{
            this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
            this.updateTable();
        }
      )
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'DATOS VACIOS', detail: 'SELECCIONAR FECHA', life: 3000 });
    }
    

    
  }

  

}
