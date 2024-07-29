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

  MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  valorTipo = 'SI'
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
  
  resultado = this.diferenciaEntreDiasEnDias(this.dia1, this.dia2);
  

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

    
    if(this.permiso != null && this.permiso.idPermiso > 0){
      console.log('UPDATE')
    }
    else
    {
      this.permiso.fechaDesde = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    
  
    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.permiso !=null && this.permiso.idPermiso >0 ){
      //UPDATE
      let ts = this.diferenciaEntreDiasEnDias(this.permiso.fechaDesde, this.permiso.fechaHasta);
      this.permiso.diasFalta = parseInt(ts.toString()) + 1;
      console.log(ts.toString());
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
    console.log(moment(this.permiso.fechaRegistro).format('YYYY-MM-DDTHH:mm:ss')  ,"FECHA");
    this.permisoService
    .save(this.permiso)
    .pipe(switchMap(()=>this.permisoService.findAll()))
    .subscribe(data=>{
      this.permisoService.setPermisoChange(data);
      this.permisoService.setMessageChange('CREATED');
      
    });
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


}
