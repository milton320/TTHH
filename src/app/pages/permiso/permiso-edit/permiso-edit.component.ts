import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Permiso } from '../../../model/permiso';
import { Persona } from '../../../model/persona';
import { PersonaService } from '../../../services/persona.service';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-permiso-edit',
  standalone: true,
  imports: [ReactiveFormsModule,MaterialModule,CommonModule,FormsModule,FloatLabelModule,RouterLink],
  templateUrl: './permiso-edit.component.html',
  styleUrl: './permiso-edit.component.css'
})
export class PermisoEditComponent  implements OnInit{
  form:FormGroup
  id: number;
  isEdit: boolean;
  valorTipo = 'SI'
  permiso: Permiso

  persona:Persona[];
  constructor(

  private route:ActivatedRoute,
  private router:Router,
  private personaService: PersonaService,
  private permisoService: PermisoService,

 ){
  
 }
  ngOnInit(): void {
    this.form = new FormGroup({
      idPermiso: new FormControl(0),
      persona:new FormControl( ),
      tipoPermiso: new FormControl(1),
      fechaDesde: new FormControl(),
      fechaHasta: new FormControl(),
      fechaReintegro: new FormControl(),
      diasFalta: new FormControl(),
      estadoPermiso: new FormControl(),
      motivo: new FormControl(''),
      monto: new FormControl(0),
    })

    this.route.params.subscribe(data =>{
      this.id = data['id'];
      this.isEdit = data['id'] !=null;
      this.initForm();
    })
    
  }

  initForm(){
    if(this.isEdit){
      this.permisoService.findById(this.id).subscribe(data=>{
        this.form = new FormGroup({
          idPermiso: new FormControl(data.idPermiso),
          persona:new FormControl(data.persona.primerNombre),
          tipoPermiso: new FormControl(data.estadoPermiso),
          fechaDesde: new FormControl(data.fechaDesde),
          fechaHasta: new FormControl(data.fechaHasta),
          fechaReintegro: new FormControl(data.fechaReintegro),
          diasFalta: new FormControl(data.diasFalta),
          estadoPermiso: new FormControl(data.estadoPermiso),
          motivo: new FormControl(data.motivo),
          monto: new FormControl(data.motivo),
        })
        console.log(this.form);
      })
    }
  }
  operate(){
    console.log("!operate");
  }
}

