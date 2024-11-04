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
  totalAnticipo:number=0


  
  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private anticipoService: AnticipoService,
    
  )
  {}

  ngOnInit(): void {
    this.messages = [{ severity: 'error', detail: 'EL ANTICIPO DEBE SER MENOR QUE EL SUELDO ACTUAL' }];
    this.anticipo = {...this.config.data}
    
    this.totalAnticipo = this.anticipo.monto
    
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
  operate() {
    // Verificar si el monto del anticipo es menor al sueldo base de la persona
    if (this.anticipo.monto < this.anticipo.persona.sueldoBase) {
      console.log('save');
      
      // Actualización (UPDATE)
      if (this.anticipo != null && this.anticipo.idAnticipo > 0) {
        this.updateAnticipo(); // Extraer la lógica de actualización en un método separado
      } 
      // Inserción (INSERT)
      else {
        this.anticipoService.nroAnticipos(this.anticipo.persona.idPersona).subscribe({
          next: (anticiposExistentes) => {
            if (anticiposExistentes.length > 0) {
              this.messages = [{ severity: 'error', detail: 'La persona ya tiene un anticipo registrado' }];
              this.sueldoEstado = false;
            } else {
              this.insertAnticipo(); // Extraer la lógica de inserción en un método separado
            }
          },
          error: (e) => {
            this.messages = [{ severity: 'error', detail: 'Error al verificar anticipos existentes' }];
          }
        });
      }
    } 
    else {
      this.sueldoEstado = false;
    }
  }
  
  private updateAnticipo() {
    this.anticipoService
      .update(this.anticipo.idAnticipo, this.anticipo)
      .pipe(
        switchMap(() => this.anticipoService.findAll())
      )
      .subscribe({
        next: (data) => {
          this.anticipoService.setAnticipoChange(data);
          this.anticipoService.setMessageChange('UPDATE!');
          this.close(); // Cerrar después de la actualización
        },
        error: (e) => {
          this.anticipoService.setMessageChange('ERROR!');
        }
      });
  }
  
  private insertAnticipo() {
    this.anticipoService
      .save(this.anticipo)
      .pipe(
        switchMap(() => this.anticipoService.findAll())
      )
      .subscribe({
        next: (data) => {
          this.anticipoService.setAnticipoChange(data);
          this.anticipoService.setMessageChange('CREATED');
          this.close(); // Cerrar después de la inserción
        },
        error: (e) => {
          this.anticipoService.setMessageChange('ERROR!');
        }
      });
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
