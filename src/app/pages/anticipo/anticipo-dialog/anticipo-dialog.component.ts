import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MaterialModule } from '../../../material/material.module';
import { Persona } from '../../../model/persona';
import { Anticipo } from '../../../model/anticipo';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { AnticipoService } from '../../../services/anticipo.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-anticipo-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './anticipo-dialog.component.html',
  styleUrl: './anticipo-dialog.component.css'
})
export class AnticipoDialogComponent implements OnInit {
  persona:Persona[]
  anticipo:Anticipo
  
  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private anticipoService: AnticipoService,
    
  )
  {}

  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.anticipo = {...this.config.data}

    if(this.anticipo != null && this.anticipo.idAnticipo > 0){
      console.log('UPDATE')
    }
    else
    {
      this.anticipo.fechaRegistro = new Date();
    }
    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

     /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.anticipo !=null && this.anticipo.idAnticipo >0 ){
      //UPDATE
      this.anticipoService
      .update(this.anticipo.idAnticipo, this.anticipo)
      .pipe(switchMap(()=>this.anticipoService.findAll()))
      .subscribe(data=>{
        this.anticipoService.setAnticipoChange(data);
        this.anticipoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    console.log(this.anticipo);
    this.anticipoService
    .save(this.anticipo)
    .pipe(switchMap(()=>this.anticipoService.findAll()))
    .subscribe(data=>{
      this.anticipoService.setAnticipoChange(data);
      this.anticipoService.setMessageChange('CREATED');
      
    });
    }
    this.close();
  }
     
     close() {
       this.ref.close();
     }
}
