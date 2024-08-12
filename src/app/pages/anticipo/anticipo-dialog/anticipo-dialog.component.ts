import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Message } from 'primeng/api';
import moment from 'moment';

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
  selectedCountry: any;
  filtrarPersonas: any[] | undefined;
  sueldoEstado:boolean = true
  messages: Message[] | undefined;


  
  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private anticipoService: AnticipoService,
    
  )
  {}

  ngOnInit(): void {
    this.messages = [{ severity: 'error', detail: 'EL ANTICIPO DEBE SER MENOR QUE EL SUELDO ACTUAL' }];
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.anticipo = {...this.config.data}

    if(this.anticipo != null && this.anticipo.idAnticipo > 0){
      console.log('UPDATE')
      
    }
    else
    {
      this.anticipo.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
      this.anticipo.estado = true
    }
    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

     /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    if(this.anticipo.monto < this.anticipo.persona.sueldoBase)
    {
      console.log('save');
      if(this.anticipo !=null && this.anticipo.idAnticipo >0 ){
        //UPDATE
        console.log(this.anticipo.monto);
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
    else{
      this.sueldoEstado = false
    }
  }
     
  close() {
    this.ref.close();
  }

  /** FILTRAR POR NOMBRES */
  filterPersonas(event: AutoCompleteCompleteEvent){

    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.persona as any[]).length; i++) {
      let personas = (this.persona as any[])[i];
      if (personas.ci.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(personas);
      }
    }
    this.filtrarPersonas = filtered;
  }

}
