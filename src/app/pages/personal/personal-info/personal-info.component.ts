import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Persona } from '../../../model/persona';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit{
  persona:Persona;
  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
  ){
    
  }
  ngOnInit(){
    this.persona = {...this.config.data}
  
  }

}
