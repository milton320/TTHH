import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../model/persona';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { SucursalService } from '../../../services/sucursal.service';
import { Sucursal } from '../../../model/sucursal';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PrimeNGConfig } from 'primeng/api';
import moment from 'moment';
import { FechasPipe } from '../../../pipes/fechas.pipe';
import { TipoCargo } from '../../../model/tipoCargo';
import { TipoCargoService } from '../../../services/tipo-cargo.service';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { TipoContrato } from '../../../model/tipoContrato';

@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule,FormsModule,FechasPipe],
  templateUrl: './personal-dialog.component.html',
  styleUrl: './personal-dialog.component.css'
})
export class PersonalDialogComponent implements OnInit {
  persona:Persona;
  sucursal: Sucursal[];
  tipoCargo:TipoCargo[];
  tipoContrato:TipoContrato[];

  required=true;
  


  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    private cargoService: TipoCargoService,
    private contratoServicio: TipoContratoService

  )
  {}

  ngOnInit(): void {
  
    this.persona = {...this.config.data}

    console.log(this.required);
    if(this.persona != null && this.persona.idPersona > 0){
      console.log('UPDATE')
    }
    else
    {
      this.persona.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
      console.log(this.persona.fechaRegistro);
    }

    this.sucursalService.findAll().subscribe(data =>{this.sucursal = data});
    this.cargoService.findAll().subscribe(data =>{this.tipoCargo = data})
    this.contratoServicio.findAll().subscribe(data =>{this.tipoContrato =data})
       
  }
   /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.persona !=null && this.persona.idPersona >0 ){
      //UPDATE
      this.personaService
      .update(this.persona.idPersona, this.persona)
      .pipe(switchMap(()=>this.personaService.findAll()))
      .subscribe(data=>{
        this.personaService.setPersonaChange(data);
        this.personaService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    this.persona.fechaIngreso = moment( this.persona.fechaIngreso).format('YYYY-MM-DDTHH:mm:ss');
    this.persona.fechaNacimiento= moment(this.persona.fechaNacimiento).format('YYYY-MM-DDTHH:mm:ss');
    this.persona.totalVacacion = 0;
    this.persona.totalVacacionUs = 0;
    console.log(this.persona);
    this.personaService
    .save(this.persona)
    .pipe(switchMap(()=>this.personaService.findAll()))
    .subscribe(data=>{
      this.personaService.setPersonaChange(data);
      this.personaService.setMessageChange('CREATED');
      
    });
    }
    this.close();
  }
  
  close() {
    this.ref.close();
  }



}
