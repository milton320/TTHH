import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Permiso } from '../../../model/permiso';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { SucursalService } from '../../../services/sucursal.service';
import { Persona } from '../../../model/persona';
import { switchMap } from 'rxjs';
import { PermisoService } from '../../../services/permiso.service';
import  moment from 'moment';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FechasPipe } from '../../../pipes/fechas.pipe';

@Component({
  selector: 'app-permiso-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterLink,FormsModule,FloatLabelModule,FechasPipe],
  templateUrl: './permiso-dialog.component.html',
  styleUrl: './permiso-dialog.component.css'
})
export class PermisoDialogComponent implements OnInit{

  permiso: Permiso
  persona:Persona[];
  filtrarPersonas: any[] | undefined;
  fechaIn:string
  fechaFn:string
  fechaReintegro: string
  valorTipo = 'SI'

    // Signals para las fechas
    fechaDesde = signal<Date | null>(null); // Fecha inicial
    fechaHasta = signal<Date | null>(null); // Fecha final
    minDate = new Date(2023, 0, 1);  // Fecha mínima permitida
    maxDate = new Date(2024, 11, 31); // Fecha máxima permitida

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
    private permisoService: PermisoService,
    
  )
  {
    this.permiso = new Permiso(0)
  
     // Efecto para hacer algo cuando cambia la fecha
     effect(() => {
      console.log('Fecha Desde:', this.fechaDesde(), 'Fecha Hasta:', this.fechaHasta());
    });
    // Efecto para observar los cambios en los días hábiles
    effect(() => {
      console.log('Días hábiles entre las fechas:', this.diasHabiles());
    });
  }
  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.permiso = {...this.config.data}

    

    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

    // Métodos para manejar el cambio de las fechas
    onFechaDesdeChange(event: Date | null) {
      this.fechaDesde.set(event);
    }
  
    onFechaHastaChange(event: Date | null) {
      this.fechaHasta.set(event);
    }

  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.permiso !=null && this.permiso.idPermiso >0 ){
      //UPDATE
      this.permiso.diasFalta = this.diasHabiles()
      this.permisoService
      .update(this.permiso.idPermiso, this.permiso)
      .pipe(switchMap(()=>this.permisoService.findAll()))
      .subscribe(data=>{
        this.permisoService.setPermisoChange(data);
        this.permisoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    /* console.log(this.permiso.fechaDesde ,"FECHA desde");
    let ts = this.diferenciaEntreDiasEnDias(this.permiso.fechaDesde, this.permiso.fechaHasta);
    this.permiso.diasFalta = parseInt(ts.toString()) + 1; 
    console.log(ts.toString());*/
    this.fechaIn = this.permiso.fechaDesde
    this.fechaFn = this.permiso.fechaHasta
    


    if(this.valorTipo == 'SI'){
      const permisF={
        idPermiso: this.permiso.idPermiso,
        persona:this.permiso.persona,
        tipoPermiso:this.permiso.tipoPermiso,
        fechaDesde:moment(this.permiso.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
        fechaHasta:moment(this.permiso.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
        /* fechaReintegro:moment(this.permiso.fechaReintegro).format('YYYY-MM-DDTHH:mm:ss'), */
  
        /* diasFalta:moment(this.fechaFn).diff(this.fechaIn, 'days', true), */
        tipoFechaHora: 'dias',
        diasFalta: this.diasHabiles(),
        /* estadoPermiso:this.permiso.estadoPermiso, */
        motivo:this.permiso.motivo,
        monto:this.permiso.monto,
        fechaRegistro:moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      }
      this.permisoService
    .save(permisF)
    .pipe(switchMap(()=>this.permisoService.findAll()))
    .subscribe(data=>{
      this.permisoService.setPermisoChange(data);
      this.permisoService.setMessageChange('CREATED');
    });
    }
    else{
      const permisF={
        idPermiso: this.permiso.idPermiso,
        persona:this.permiso.persona,
        tipoPermiso:this.permiso.tipoPermiso,
        fechaDesde:moment(this.permiso.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
        fechaHasta:moment(this.permiso.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
        /* fechaReintegro:moment(this.permiso.fechaReintegro).format('YYYY-MM-DDTHH:mm:ss'), */
        tipoFechaHora: 'horas',
        diasFalta:moment(this.fechaFn).diff(this.fechaIn, 'hours', true) , 
        
        /* diasFalta: this.diasLaborales(this.fechaIn,this.fechaFn), */
        /* estadoPermiso:this.permiso.estadoPermiso, */
        motivo:this.permiso.motivo,
        monto:this.permiso.monto
        
      }
      this.permisoService
    .save(permisF)
    .pipe(switchMap(()=>this.permisoService.findAll()))
    .subscribe(data=>{
      this.permisoService.setPermisoChange(data);
      this.permisoService.setMessageChange('CREATED');
    });
    }
    console.log(moment(this.fechaFn).diff(this.fechaIn, 'hours'), 'Dias de diferencias');
    
    }
    this.close();
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
      // Si no es domingo
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


}
