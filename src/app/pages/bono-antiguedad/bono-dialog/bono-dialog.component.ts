import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MaterialModule } from '../../../material/material.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BonoAntiguedadService } from '../../../services/bono-antiguedad.service';
import { Message } from 'primeng/api';
import { BonoAntiguedad } from '../../../model/bonoAntiguedad';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-bono-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule],
  templateUrl: './bono-dialog.component.html',
  styleUrl: './bono-dialog.component.css'
})
export class BonoDialogComponent implements OnInit{
  bono:BonoAntiguedad
  messages: Message[] | undefined;
  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private bonoAntiguedadService: BonoAntiguedadService,
  ){

  }
  
  ngOnInit(): void {
    this.bono = {...this.config.data}
  }
  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
  
    if(this.bono !=null && this.bono.idBoleta >0 ){
      //UPDATE
      this.bonoAntiguedadService
      .update(this.bono.idBoleta, this.bono)
      .pipe(switchMap(()=>this.bonoAntiguedadService.findAll()))
      .subscribe(data=>{
        this.bonoAntiguedadService.setBonoAntiguedadChange(data);
        this.bonoAntiguedadService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    
    this.bonoAntiguedadService
    .save(this.bono)
    .pipe(switchMap(()=>this.bonoAntiguedadService.findAll()))
    .subscribe(data=>{
      this.bonoAntiguedadService.setBonoAntiguedadChange(data);
      this.bonoAntiguedadService.setMessageChange('CREATED');
      
    });
    }
    this.close();
  }
  close() {
    this.ref.close();
  }

}
