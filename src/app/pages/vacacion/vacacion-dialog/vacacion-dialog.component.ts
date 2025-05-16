import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { Vacacion } from '../../../model/vacacion';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacacionService } from '../../../services/vacacion.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MaterialModule } from '../../../material/material.module';
import { Persona } from '../../../model/persona';
import { PersonaService } from '../../../services/persona.service';

import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import moment from 'moment';
import { FechasPipe } from '../../../pipes/fechas.pipe';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vacacion-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule,FechasPipe],
  templateUrl: './vacacion-dialog.component.html',
  styleUrl: './vacacion-dialog.component.css'
})
export class VacacionDialogComponent {
  persona:Persona[]
  vacacion:Vacacion
  filtrarPersonas: any[] | undefined;
  fechaIn:string
  fechaFn:string
  // Signals para las fechas
  fechaDesde = signal<Date | null>(null); // Fecha inicial
  fechaHasta = signal<Date | null>(null); // Fecha final
  minDate = new Date(2023, 0, 1);  // Fecha mínima permitida
  maxDate = new Date(2025, 11, 31); // Fecha máxima permitida

  personaVacacion:any 
  cantidadVacacion:any = 0
  vacacionAntigua:number = 0

  // Validación de la relación entre las dos fechas
rangoFechasInvalido = computed(() => {
  const desde = this.fechaDesde();
  const hasta = this.fechaHasta();

  if (!desde || !hasta) {
    return 'Ambas fechas son obligatorias.';
  }

  if (desde > hasta) {
    return 'La fecha "Desde" no puede ser posterior a la fecha "Hasta".';
  }
  return null;
});
// Señal computada para contar los días hábiles (lunes a sábado)
diasHabiles = computed(() => {
const desde = this.fechaDesde();
const hasta = this.fechaHasta();

// Verificar que ambas fechas están seleccionadas
if (!desde || !hasta) {
  return 0;
}

// Contar los días hábiles excluyendo los domingos
return this.contarDiasHabiles(desde, hasta);
});


constructor( 
  public ref: DynamicDialogRef, 
  public config: DynamicDialogConfig,
  private personaService: PersonaService,
  private vacacionService: VacacionService,
  private messageService: MessageService
  
)
{}

ngOnInit(): void {
  console.log("~ this.dialogConfig.data:", this.config.data)
  this.vacacion = {...this.config.data}
  this.vacacionAntigua = this.vacacion.diasVacacion


  if(this.vacacion != null && this.vacacion.idVacacion > 0){
    console.log('')
  }
  else
  {
    //this.vacacion.fechaRegistro = new Date();
  }
  this.personaService.findAll().subscribe(data =>{this.persona = data});
  
  /* this.personaService.personaVacacion(91).subscribe(
    data =>{
      this.personaVacacion = data
      console.log(data);
    }
  ) */

} 

  /* operate()
  {
    console.log('save');
    if(this.vacacion !=null && this.vacacion.idVacacion >0 ){
      //UPDATE
      this.vacacion.diasFalta = this.diasHabiles()
      this.vacacionService
      .update(this.vacacion.idVacacion, this.vacacion)
      .pipe(switchMap(()=>this.vacacionService.findAll()))
      .subscribe(data=>{
        this.vacacionService.setVacionChange(data);
        this.vacacionService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    this.fechaIn = this.vacacion.fechaDesde
    this.fechaFn = this.vacacion.fechaHasta
    
    const vacacionF={
      idVacacion: this.vacacion.idVacacion,
      persona:this.vacacion.persona,
      fechaDesde:moment(this.vacacion.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
      fechaHasta:moment(this.vacacion.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
      descripcion:this.vacacion.descripcion,
      diasFalta: this.diasHabiles(),
      fechaRegistro:moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      
    }
    console.log(vacacionF);
    this.vacacionService
    .save(vacacionF)
    .pipe(switchMap(()=>this.vacacionService.findAll()))
    .subscribe(data=>{
      this.vacacionService.setVacionChange(data);
      this.vacacionService.setMessageChange('CREATED');
      
    });
    }
    this.close();
  } */
/*     operate() {
      console.log('save');
    
      // Verificamos los días disponibles antes de proceder
      this.vacacionService.calcularDiasDisponibles(this.vacacion.persona.idPersona).subscribe(diasDisponibles => {
        const diasHabilesCalculados = this.diasHabiles(); // Calculamos los días hábiles
    
        if (diasHabilesCalculados > diasDisponibles) {
          // Si los días hábiles exceden los días disponibles, mostrar un mensaje de error
          this.vacacionService.setMessageChange('No tiene suficientes días disponibles');
          return; // Cancelar la operación si no tiene suficientes días
        }
    
        // Si tiene suficientes días, procedemos
        if (this.vacacion != null && this.vacacion.idVacacion > 0) {
          // UPDATE
          this.vacacion.diasFalta = diasHabilesCalculados;
    
          this.vacacionService.update(this.vacacion.idVacacion, this.vacacion)
            .pipe(switchMap(() => this.vacacionService.findAll())) // Actualizar la lista después del update
            .subscribe(data => {
              this.vacacionService.setVacionChange(data);
              this.vacacionService.setMessageChange('UPDATE!');
            });
    
        } else {
          // INSERT
          this.fechaIn = this.vacacion.fechaDesde;
          this.fechaFn = this.vacacion.fechaHasta;
    
          // Crear el objeto de vacación para enviar
          const vacacionF = {
            idVacacion: this.vacacion.idVacacion,
            persona: this.vacacion.persona,
            fechaDesde: moment(this.vacacion.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
            fechaHasta: moment(this.vacacion.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
            descripcion: this.vacacion.descripcion,
            diasFalta: diasHabilesCalculados,
            fechaRegistro: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
          };
    
          console.log(vacacionF);
    
          this.vacacionService.registroVacaciones(vacacionF)
            .pipe(switchMap(() => this.vacacionService.findAll())) // Actualizar la lista después del insert
            .subscribe(data => {
              this.vacacionService.setVacionChange(data);
              this.vacacionService.setMessageChange('CREATED');
            });
        }
    
        this.close(); // Cerrar el formulario o modal después de guardar
      });
    }
     */
    operate() {
      this.personaService.personaVacacion(this.vacacion.persona.idPersona).subscribe(diasPersona => {
        this.cantidadVacacion = diasPersona[0]?.vacacionPersona ?? 0;
    
        const diasCalculados = this.diasHabiles();
    
        // Validación: no puede usar más días de los que tiene
        if (diasCalculados > this.cantidadVacacion) {
          this.messageService.add({
            severity: 'error',

            detail: `Solo tiene ${this.cantidadVacacion} día(s) disponible(s), pero seleccionó ${diasCalculados}.`,
          });
          this.close();
          return;
        }
    
        const fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
    
        const vacacionF: any = {
          idVacacion: this.vacacion.idVacacion,
          persona: this.vacacion.persona,
          fechaDesde: moment(this.vacacion.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
          fechaHasta: moment(this.vacacion.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
          descripcion: this.vacacion.descripcion,
          diasVacacion: diasCalculados,
          fechaRegistro: fechaRegistro
        };
    
        if (this.vacacion?.idVacacion > 0) {
          vacacionF.diasVacacionActualizacion = this.vacacionAntigua;
    
          this.vacacionService.update(this.vacacion.idVacacion, vacacionF)
            .pipe(switchMap(() => this.vacacionService.findAll()))
            .subscribe(data => {
              this.vacacionService.setVacionChange(data);
              this.vacacionService.setMessageChange('UPDATE!');
              this.close();
            });
        } else {
          this.vacacionService.save(vacacionF)
            .pipe(switchMap(() => this.vacacionService.findAll()))
            .subscribe(data => {
              this.vacacionService.setVacionChange(data);
              this.vacacionService.setMessageChange('CREATED');
              this.close();
            });
        }
      });
    }
    
    
    

  close() {
    this.ref.close();
  }

  /** FILTRAR POR NOMBRES */
  filterPersonas(event: AutoCompleteCompleteEvent){

    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.persona as any[]).length; i++) {
      let personas = (this.persona as any[])[i];
      if (personas.ci.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(personas);
      }
    }
    this.filtrarPersonas = filtered;
  }

  /** FUNCION PARA RESTRINGIR DOMINGOS */

  diasLaborales(fechaInicio, fechaFin) {
    let from = moment(fechaInicio, 'YYYY-MM-DDTHH:mm:ss'),
    to = moment(fechaFin, 'YYYY-MM-DDTHH:mm:ss'),
    days = 0;
    
    while (!from.isAfter(to)) {
      // Si no es sabado ni domingo
      if (from.isoWeekday() !== 7) {
        days++;
      }
      from.add(1, 'days');
    }
    return days;
  }
  // Función para contar los días entre "fechaDesde" y "fechaHasta" excluyendo los domingos
  contarDiasHabiles(fechaDesde: Date, fechaHasta: Date): number {
    let contador = 0;
    let currentDate = new Date(fechaDesde);

    // Iterar desde fechaDesde hasta fechaHasta
    while (currentDate <= fechaHasta) {
      const dayOfWeek = currentDate.getDay(); // getDay() devuelve 0 para Domingo, 6 para Sábado

      // Contar solo si es de lunes a sábado (excluir domingo que es 0)
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        contador++;
      }

      // Mover al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return contador;
  }
  // Métodos para manejar el cambio de las fechas
  onFechaDesdeChange(event: Date | null) {
    this.fechaDesde.set(event);
  }

  onFechaHastaChange(event: Date | null) {
    this.fechaHasta.set(event);
  }

  idPersonaFunction(event: number){
    console.log(event);
  }
}
