import { Component, OnInit } from '@angular/core';
import { Atraso } from '../../model/atraso';
import { AtrasoService } from '../../services/atraso.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { JustificativoAtrasoService } from '../../services/justificativo-atraso.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-atraso',
  standalone: true,
  imports: [MaterialModule,CommonModule,InputTextModule,ButtonModule,InputTextareaModule, FormsModule,ToastModule],
  templateUrl: './atraso.component.html',
  styleUrl: './atraso.component.css'
})
export class AtrasoComponent implements OnInit{
  atraso!:Atraso[];
  atraso2:Atraso

  
  constructor(
    private atrasoService: AtrasoService,
    private justificativoAtrasoService:JustificativoAtrasoService
  ){}
  ngOnInit(): void {
    this.atrasoService.findAll().subscribe(data=>{
      this.atraso = data
      
    })
  }
  ngOnChange(){
    this.atraso2 = {...this.atraso2}
  }

  showDialog(){
    console.log(this.atraso);
    
    this.atraso.forEach(element => {

      this.atrasoService
      .saveOtherAtraso(element)
      .pipe(switchMap(()=>this.atrasoService.findAllOtherAtraso()))
      .subscribe(data=>{
        console.log(data);
      })


    });
    
  }

}
