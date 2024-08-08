import { Component, OnInit } from '@angular/core';
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



  /*MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  
  myMoment: moment.Moment = moment();
  es: any;



   diferenciaEntreDiasEnDias(a, b)
  {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(),);
  
    return Math.floor((utc2 - utc1) / this.MILISENGUNDOS_POR_DIA);
  }
  dia1 = new Date();
  dia2 = new Date();
  
  resultado = this.diferenciaEntreDiasEnDias(this.dia1, this.dia2); */
  

  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private permisoService: PermisoService,
    
  )
  {}
  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.permiso = {...this.config.data}

    
    /* if(this.permiso != null && this.permiso.idPermiso > 0){
      this.permiso.fechaModificacion = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }
    else
    {
      this.permiso.fechaRegistro = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    } */
    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.permiso !=null && this.permiso.idPermiso >0 ){
      //UPDATE
  
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
    

    console.log(this.valorTipo, 'VALORtIPO');

    if(this.valorTipo == 'SI'){
      const permisF={
        idPermiso: this.permiso.idPermiso,
        persona:this.permiso.persona,
        tipoPermiso:this.permiso.tipoPermiso,
        fechaDesde:moment(this.permiso.fechaDesde).format('YYYY-MM-DDTHH:mm:ss'),
        fechaHasta:moment(this.permiso.fechaHasta).format('YYYY-MM-DDTHH:mm:ss'),
        fechaReintegro:moment(this.permiso.fechaReintegro).format('YYYY-MM-DDTHH:mm:ss'),
  
        /* diasFalta:moment(this.fechaFn).diff(this.fechaIn, 'days', true), */
        
        diasFalta: this.diasLaborales(this.fechaIn,this.fechaFn),
        estadoPermiso:this.permiso.estadoPermiso,
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
        fechaReintegro:moment(this.permiso.fechaReintegro).format('YYYY-MM-DDTHH:mm:ss'),
  
        diasFalta:moment(this.fechaFn).diff(this.fechaIn, 'hours', true) , 
        
        /* diasFalta: this.diasLaborales(this.fechaIn,this.fechaFn), */
        estadoPermiso:this.permiso.estadoPermiso,
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


}
