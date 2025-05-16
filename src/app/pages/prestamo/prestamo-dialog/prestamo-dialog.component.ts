import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MaterialModule } from '../../../material/material.module';
import { Persona } from '../../../model/persona';
import { Prestamo } from '../../../model/prestamo';
import { Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { PrestamoService } from '../../../services/prestamo.service';
import moment from 'moment';
import { switchMap } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-prestamo-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule],
  templateUrl: './prestamo-dialog.component.html',
  styleUrl: './prestamo-dialog.component.css'
})
export class PrestamoDialogComponent implements OnInit{
  persona:Persona[]
  prestamo:Prestamo
  selectedCountry: any;
  filtrarPersonas: any[] | undefined;
  messages: Message[] | undefined;

  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private prestamoService: PrestamoService 
  )
  {}
  ngOnInit(): void {
    this.messages = [{ severity: 'error', detail: 'EL ANTICIPO DEBE SER MENOR QUE EL SUELDO ACTUAL' }];
    
    this.prestamo = {...this.config.data}

    if(this.prestamo != null && this.prestamo.idPrestamo > 0){
      console.log('')
    }
    else
    {
      this.prestamo.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
     
    }
    this.personaService.findAll().subscribe(data =>{this.persona = data});
  }
  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {

    if(this.prestamo !=null && this.prestamo.idPrestamo >0 ){
      //UPDATE
      this.prestamoService
      .update(this.prestamo.idPrestamo, this.prestamo)
      .pipe(switchMap(()=>this.prestamoService.findAll()))
      .subscribe(data=>{
        this.prestamoService.setPrestamoChange(data);
        this.prestamoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
      this.prestamoService
      .save(this.prestamo)
      .pipe(switchMap(()=>this.prestamoService.findAll()))
      .subscribe(data=>{
        this.prestamoService.setPrestamoChange(data);
        this.prestamoService.setMessageChange('CREATED');
      });
    }
    this.close();
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
