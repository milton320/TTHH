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



@Component({
  selector: 'app-vacacion-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './vacacion-dialog.component.html',
  styleUrl: './vacacion-dialog.component.css'
})
export class VacacionDialogComponent {
  persona:Persona[]
  vacacion:Vacacion


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
    this.vacacion.fechaRegistro = new Date();
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
    console.log(this.vacacion);
    this.vacacionService
    .save(this.vacacion)
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


}
