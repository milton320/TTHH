import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PersonaService } from '../../../services/persona.service';
import { PrimeNGConfig } from 'primeng/api';
import { Persona } from '../../../model/persona';
import { Sucursal } from '../../../model/sucursal';
import { SucursalService } from '../../../services/sucursal.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-personal-edit',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './personal-edit.component.html',
  styleUrl: './personal-edit.component.css'
})
export class PersonalEditComponent implements OnInit {
  

  form:FormGroup;
  id: number;
  isEdit: boolean;
  es: any;
  tcontratos:any[]
  sucursal:Sucursal[]


  generoList:any[]=[
    { name:'FEMENINO', key:'F' },
    { name:'MASCULINO', key:'M' }
  ]

  private route = inject(ActivatedRoute)  
  private personaService = inject(PersonaService)  
  private primengConfig = inject(PrimeNGConfig)
  private sucursalService = inject(SucursalService)

  ngOnInit(){
    this.tcontratos =[
      {name:'EVENTUAL'},
      {name:'PASANTE'},
      {name:'INDEFINIDO'},
      {name:'EXTERNO'}
      
    ]
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
  }
  this.primengConfig.setTranslation(this.es)



    this.form = new FormGroup({
      primerNombre: new FormControl(),
      segundoNombre: new FormControl(),
      primerApellido: new FormControl(),
      segundoApellido: new FormControl(),
      ci: new FormControl(),
      genero: new FormControl(['F', []]),
      fechaNacimiento: new FormControl(),
      cuenta: new FormControl(),
      fechaIngreso: new FormControl(),
      fechaRetiro: new FormControl(),
      tipoContrato: new FormControl(),
      cargo: new FormControl(),
      sueldoBase: new FormControl(),
      idPersona: new FormControl(),
      idSucursal: new FormControl(),    
    });

    this.route.params.subscribe(data =>{
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

    this.sucursalService.findAll().subscribe(data=>this.sucursal=data)

  }

  initForm(){

    if(this.isEdit){
      this.personaService.findById(this.id).subscribe(data=>{
        console.log(data);
        this.form = new FormGroup({
          primerNombre: new FormControl(data.primerNombre),
          segundoNombre: new FormControl(data.segundoNombre),
          primerApellido: new FormControl(data.primerApellido),
          segundoApellido: new FormControl(data.segundoApellido),
          ci: new FormControl(data.ci),
          genero: new FormControl(data.genero),
          fechaNacimiento: new FormControl(data.fechaNacimiento),
          cuenta: new FormControl(data.cuenta),
          fechaIngreso: new FormControl(data.fechaIngreso),
          fechaRetiro: new FormControl(data.fechaRetiro),
          tipoContrato: new FormControl(data.tipoContrato),
          cargo: new FormControl(data.cargo),
          sueldoBase: new FormControl(data.sueldoBase),
          idPersona: new FormControl(data.idPersona),
          idSucursal: new FormControl(data.sucursal.idSucursal),    
        });
      })
    }
  }
  
  operate()
  {
    const persona:Persona = new Persona();
    console.log(persona);
    persona.primerNombre = this.form.value['primerNombre']
    persona.segundoNombre = this.form.value['segundoNombre']
    persona.primerApellido = this.form.value['primerApellido']
    persona.segundoApellido = this.form.value['segundoApellido']
    persona.ci = this.form.value['ci']
    persona.genero = this.form.value['genero']
    persona.fechaNacimiento = this.form.value['fechaNacimiento']
    persona.cuenta = this.form.value['cuenta']
    persona.fechaIngreso = this.form.value['fechaIngreso']
    persona.fechaRetiro = this.form.value['fechaRetiro']
    persona.tipoContrato = this.form.value['tipoContrato']
    persona.cargo = this.form.value['cargo']
    persona.sueldoBase = this.form.value['sueldoBase']
    persona.idPersona = this.form.value['idPersona']
    persona.sucursal = this.form.value['idSucursal']

    if(this.isEdit){
      this.personaService.update(this.id, persona).subscribe(()=>{
        this.personaService.findAll().subscribe(data=>{
            this.personaService.setPersonaChange(data);
        })

      });
    }else{

      this.personaService.save(persona)
      .pipe(switchMap(()=> this.personaService.findAll()))
      .subscribe(data=>{
        this.personaService.setPersonaChange(data)
      })
    }
     
  }

}
