import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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



@Component({
  selector: 'app-vacacion-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule,FechasPipe],
  templateUrl: './vacacion-dialog.component.html',
  styleUrl: './vacacion-dialog.component.css'
})
export class VacacionDialogComponent {
  persona:Persona[]
  vacacion:Vacacion
  filtrarPersonas: any[] | undefined;
  fechaIn:string
  fechaFn:string

constructor( 
  public ref: DynamicDialogRef, 
  public config: DynamicDialogConfig,
  private personaService: PersonaService,
  private vacacionService: VacacionService,
  
)
{}

ngOnInit(): void {
  console.log("~ this.dialogConfig.data:", this.config.data)
  this.vacacion = {...this.config.data}


  if(this.vacacion != null && this.vacacion.idVacacion > 0){
    console.log('UPDATE')
  }
  else
  {
    //this.vacacion.fechaRegistro = new Date();
  }



  this.personaService.findAll().subscribe(data =>{this.persona = data});

  
} 

  operate()
  {
    console.log('save');
    if(this.vacacion !=null && this.vacacion.idVacacion >0 ){
      //UPDATE
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
      fechaReintegro:moment(this.vacacion.fechaReintegro).format('YYYY-MM-DDTHH:mm:ss'),
      diasFalta: this.diasLaborales(this.fechaIn,this.fechaFn),
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
}
