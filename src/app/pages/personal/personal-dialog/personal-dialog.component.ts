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

@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './personal-dialog.component.html',
  styleUrl: './personal-dialog.component.css'
})
export class PersonalDialogComponent implements OnInit {
  persona:Persona

/*   datetime12h: Date[] | undefined;
  datetime24h: Date[] | undefined;
  time: Date[] | undefined; */

  sucursal: Sucursal[];


  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    
  )
  {}

  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.persona = {...this.config.data}


    if(this.persona != null && this.persona.idPersona > 0){
      console.log('UPDATE')
    }
    else
    {
      this.persona.fechaRegistro = new Date();
    }


  
    this.sucursalService.findAll().subscribe(data =>{this.sucursal = data});
  
    
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
