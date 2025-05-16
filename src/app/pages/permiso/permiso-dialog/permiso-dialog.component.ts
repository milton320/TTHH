import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Permiso } from '../../../model/permiso';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../model/persona';
import { switchMap } from 'rxjs';
import { PermisoService } from '../../../services/permiso.service';
import  moment from 'moment';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FechasPipe } from '../../../pipes/fechas.pipe';
import { PermisoLista } from '../../../model/permisoLista';
import { PermisolistaService } from '../../../services/permisolista.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-permiso-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule,FechasPipe],
  templateUrl: './permiso-dialog.component.html',
  styleUrl: './permiso-dialog.component.css'
})
export class PermisoDialogComponent implements OnInit{

  permiso: Permiso
  persona:Persona[];
  permisoLista:PermisoLista[];
  cantidadDePropiedades = signal(0)
  nombrePerson:string 
  messages: Message[] | undefined;
  

  filtrarPersonas: any[] | undefined;
  fechaIn:string
  fechaFn:string
  fechaReintegro: string


    // Signals para las fechas
    fechaDesde = signal<Date | null>(null); // Fecha inicial
    fechaHasta = signal<Date | null>(null); // Fecha final

    // Validación de la relación entre las dos fechas
    rangoFechasInvalido = computed(() => {
      const desde = this.fechaDesde();
      const hasta = this.fechaHasta();
      if (!desde || !hasta) {
        return ''
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
    private permisoListaService: PermisolistaService
  )
  {
    this.permiso = new Permiso(0)
  
     // Efecto para hacer algo cuando cambia la fecha
    /* effect(() => {
      console.log('Fecha Desde:', this.fechaDesde(), 'Fecha Hasta:', this.fechaHasta());
    });
    // Efecto para observar los cambios en los días hábiles
    effect(() => {
      console.log('Días hábiles entre las fechas:', this.diasHabiles());
    }); */
  }
  ngOnInit(): void {

    this.permisoListaService.findAll().subscribe(data=>{
      this.permisoLista = data
    });
    this.permiso = {...this.config.data}
    this.cantidadDePropiedades.set (Object.keys(this.permiso).length);
    
    this.personaService.findAll().subscribe(data =>{
      this.persona = data
    });
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
    
    if(this.permiso !=null && this.permiso.idPermiso >0 ){
      //UPDATE
      this.permiso.diasFalta = this.diasHabiles()
      this.permiso.monto = this.montoPorDias()
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
      if(!this.permiso.persona || 
        !this.permiso.fechaDesde ||
        !this.permiso.fechaHasta ||
        !this.permiso.motivo ||
        !this.permiso.permisosLaboralesLista
      
      ){
        this.messages = [{ severity: 'error', detail: 'LLENAR CAMPOS' }];
        return
      }
      else{
        this.montoPorDias()
        this.fechaIn = this.permiso.fechaDesde
        this.fechaFn = this.permiso.fechaHasta
        if(!this.permiso.fechaHoraEstado){
          const permisF={
            idPermiso: this.permiso.idPermiso,
            persona:this.permiso.persona,
            tipoPermiso:this.permiso.tipoPermiso,
            fechaDesde:moment(this.permiso.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
            fechaHasta:moment(this.permiso.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
            tipoFechaHora: 'dias',
            diasFalta: this.diasHabiles(),
            /* estadoPermiso:this.permiso.estadoPermiso, */
            motivo:this.permiso.motivo,
            monto:this.montoPorDias(),
            permisosLaboralesLista:this.permiso.permisosLaboralesLista,
            fechaRegistro:moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
            fechaHoraEstado:this.permiso.fechaHoraEstado
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
            tipoFechaHora: 'horas',
            diasFalta:moment(this.fechaFn).diff(this.fechaIn, 'hours', true),
            motivo:this.permiso.motivo,
            permisosLaboralesLista:this.permiso.permisosLaboralesLista,
            monto:this.montoPorDias(),
            fechaHoraEstado:this.permiso.fechaHoraEstado
            
          }
          this.permisoService
          .save(permisF)
          .pipe(switchMap(()=>this.permisoService.findAll()))
          .subscribe(data=>{
            this.permisoService.setPermisoChange(data);
            this.permisoService.setMessageChange('CREATED');
          });
        }
      }
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

  

  nombrePersona(event:any):void{
    this.nombrePerson = event.target.value;
  }
  
  montoPorDias(){  
      if(this.permiso.tipoPermiso == true){
        if(!this.permiso.fechaHoraEstado ){
          if(this.diasHabiles() == 1){
            return 100
          }else {
            return 200 
          }  
        }else{
          return 50
        }
      }else{
        return 0
      }
     
  }

}
