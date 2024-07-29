import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Persona } from '../../../model/persona';
import { Dieta } from '../../../model/dieta';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { DietaService } from '../../../services/dieta.service';
import { switchMap } from 'rxjs';
import moment from 'moment';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';


@Component({
  selector: 'app-dieta-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './dieta-dialog.component.html',
  styleUrl: './dieta-dialog.component.css'
})
export class DietaDialogComponent implements OnInit, AfterViewInit {
  persona:Persona[]
  filtrarPersonas: any[] | undefined;
  dieta:Dieta


  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private dietaService: DietaService,
    
  )
  { }
  ngAfterViewInit(): void {
    
    /*this.selectPersona = this.dieta.persona*/
  }

  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.dieta = {...this.config.data}
    
    if(this.dieta != null && this.dieta.idDieta > 0){
      console.log('UPDATE')
    }
    else
    {
      this.dieta.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
    }
    this.personaService.findAll().subscribe(data =>{ this.persona = data });
    console.log(this.dieta,"DIETA ONITIN");
  }

  

       /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('update');
    if(this.dieta !=null && this.dieta.idDieta >0 ){
      //UPDATE
      this.dietaService
      .update(this.dieta.idDieta, this.dieta)
      .pipe(switchMap(()=>this.dietaService.findAll()))
      .subscribe(data=>{
        this.dietaService.setDietaChange(data);
        this.dietaService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    console.log(this.dieta, "DIETA");
    this.dietaService
    .save(this.dieta)
    .pipe(switchMap(()=>this.dietaService.findAll()))
    .subscribe(data=>{
      this.dietaService.setDietaChange(data);
      this.dietaService.setMessageChange('CREATED');
      
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
