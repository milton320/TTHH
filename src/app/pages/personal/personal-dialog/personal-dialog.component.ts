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

@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule,FormsModule,FechasPipe],
  templateUrl: './personal-dialog.component.html',
  styleUrl: './personal-dialog.component.css'
})
export class PersonalDialogComponent implements OnInit {
  persona:Persona

  sucursal: Sucursal[];
  es: any;


  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    private primengConfig: PrimeNGConfig

  )
  {}

  ngOnInit(): void {
  
    this.persona = {...this.config.data}


    if(this.persona != null && this.persona.idPersona > 0){
      console.log('UPDATE')
    }
    else
    {
      this.persona.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
      console.log(this.persona.fechaRegistro);
    }

    this.sucursalService.findAllSucursal().subscribe(data =>{this.sucursal = data});
    

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
    console.log(this.persona.fechaIngreso = moment().format());
    this.persona.fechaIngreso = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.persona.fechaRetiro= moment().format('YYYY-MM-DDTHH:mm:ss');
    this.persona.fechaNacimiento= moment().format('YYYY-MM-DDTHH:mm:ss');
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
