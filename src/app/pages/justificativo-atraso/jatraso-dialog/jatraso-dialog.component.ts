import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MaterialModule } from '../../../material/material.module';
import { Persona } from '../../../model/persona';
import { JusAtraso } from '../../../model/jusAtraso';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { JustificativoAtrasoService } from '../../../services/justificativo-atraso.service';
import { switchMap } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-jatraso-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './jatraso-dialog.component.html',
  styleUrl: './jatraso-dialog.component.css'
})
export class JatrasoDialogComponent {
  persona:Persona[]
  jusAtraso: JusAtraso
  filtrarPersonas: any[] | undefined;

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private justAtrasoService:JustificativoAtrasoService,
  ){}
  ngOnInit(): void {
    
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.jusAtraso = {...this.config.data}

    if(this.jusAtraso != null && this.jusAtraso.idAtraso > 0){
      console.log('UPDATE')
      
    }
    else
    {
     
    }
    this.personaService.findAll().subscribe(data =>{this.persona = data});

  }

  operate(){
    if(this.jusAtraso !=null && this.jusAtraso.idAtraso >0 ){
      //UPDATE

      this.justAtrasoService
      .update(this.jusAtraso.idAtraso, this.jusAtraso)
      .pipe(switchMap(()=>this.justAtrasoService.findAll()))
      .subscribe(data=>{
        this.justAtrasoService.setJustificativoAtrasoChange(data);
        this.justAtrasoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    console.log(this.jusAtraso);
  
    
        
        this.justAtrasoService
        .save(this.jusAtraso)
        .pipe(switchMap(()=>this.justAtrasoService.findAll()))
        .subscribe(data=>{
          this.justAtrasoService.setJustificativoAtrasoChange(data);
          this.justAtrasoService.setMessageChange('CREATED');
          
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
