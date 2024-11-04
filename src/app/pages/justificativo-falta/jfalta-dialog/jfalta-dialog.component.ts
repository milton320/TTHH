import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MaterialModule } from '../../../material/material.module';
import { Message } from 'primeng/api';
import { JustificativoFalta } from '../../../model/justificativoFalta';
import { FaltaService } from '../../../services/falta.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-jfalta-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './jfalta-dialog.component.html',
  styleUrl: './jfalta-dialog.component.css'
})
export class JfaltaDialogComponent implements OnInit{
    justFalta: JustificativoFalta;
    constructor(
      public ref: DynamicDialogRef, 
      public config: DynamicDialogConfig,
      private justificativoService: FaltaService,
      
    ){}

    ngOnInit(): void {
      this.justFalta = {...this.config.data}
      
    }

      /**REGISTRAR ACTUALIZAR */ 
  operate(){
    
    if(this.justFalta !=null && this.justFalta.idFalta >0 ){
      //UPDATE
      this.justificativoService
      .update(this.justFalta.idFalta, this.justFalta)
      .pipe(switchMap(()=>this.justificativoService.findAll()))
      .subscribe(data=>{
        this.justificativoService.setJustificadoFaltaChange(data);
        this.justificativoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    console.log(this.justFalta);
    this.justificativoService
    .save(this.justFalta)
    .pipe(switchMap(()=>this.justificativoService.findAll()))
    .subscribe(data=>{
      this.justificativoService.setJustificadoFaltaChange(data);
      this.justificativoService.setMessageChange('CREATED');

    });
    
    }
    this.close();
  }
  close() {
    this.ref.close();
  }
}
