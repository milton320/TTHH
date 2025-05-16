import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PersonaService } from '../../../services/persona.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-incremento',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule],
  
  templateUrl: './incremento.component.html',
  styleUrl: './incremento.component.css'
})
export class IncrementoComponent implements OnInit {
  form:FormGroup;
  incremento:number = 0

  constructor(
    public personaService:PersonaService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    
  ){

  }

  ngOnInit(): void {

    
  }

  operate(incremento:number)
  {
    this.personaService.postIncrementoSalaraial(incremento)
    .pipe(switchMap(()=>this.personaService.findAll())).subscribe(
      data =>{
          this.personaService.setPersonaChange(data);
          this.personaService.setMessageChange('CREATED');
      }
      
    )
    
    this.close();
  }

  cancel(){
    this.close();
  }
  close() {
    this.ref.close();
  }


}
