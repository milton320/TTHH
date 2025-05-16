import { Component, OnInit, signal } from '@angular/core';
import { Persona } from '../../../model/persona';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { SucursalService } from '../../../services/sucursal.service';
import { Sucursal } from '../../../model/sucursal';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Message, PrimeNGConfig } from 'primeng/api';
import moment from 'moment';
import { FechasPipe } from '../../../pipes/fechas.pipe';
import { TipoCargo } from '../../../model/tipoCargo';
import { TipoCargoService } from '../../../services/tipo-cargo.service';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { TipoContrato } from '../../../model/tipoContrato';
import { DocumentoService } from '../../../services/documento.service';
import { DocumentoIdentidad } from '../../../model/documentoIdentidad';
import { Nacionalidad } from '../../../model/nacionalidad';
import { NacionalidadService } from '../../../services/nacionalidad.service';
import { CajaSalud } from '../../../model/cajaSalud';
import { CajasaludService } from '../../../services/cajasalud.service';
import { AporteafpService } from '../../../services/aporteafp.service';
import { AporteAfp } from '../../../model/aporteAfp';

@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule,FormsModule,FechasPipe],
  templateUrl: './personal-dialog.component.html',
  styleUrl: './personal-dialog.component.css'
})
export class PersonalDialogComponent implements OnInit {
  persona:Persona;
  sucursal: Sucursal[];
  tipoCargo:TipoCargo[];
  tipoContrato:TipoContrato[];
  personaVacacion:Persona[]
  documentoIdentidad:DocumentoIdentidad[];
  nacionalidad:Nacionalidad[];
  cajaSalud:CajaSalud[];
  aporteAfp:AporteAfp[];
  /* requiredClass:String='' */
  messages: Message[] | undefined;
  required=true;
  fechaActual = moment();
  cantidadVacacion = signal(null);
  
  
  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    private cargoService: TipoCargoService,
    private contratoServicio: TipoContratoService,
    private documentoService: DocumentoService,
    private nacionalidadService: NacionalidadService,
    private cajaService: CajasaludService,
    private aporteAfpService: AporteafpService

  ){}

  ngOnInit(): void {
  
    this.persona = {...this.config.data}
    if(this.persona != null && this.persona.idPersona > 0){
      console.log('')
    }
    else
    {
      this.persona.fechaRegistro = moment().format('YYYY-MM-DDTHH:mm:ss');
    }
    this.sucursalService.findAll().subscribe(data =>{this.sucursal = data});
    this.cargoService.findAll().subscribe(data =>{this.tipoCargo = data})
    this.contratoServicio.findAll().subscribe(data =>{this.tipoContrato =data})  
    this.documentoService.findAll().subscribe(data =>{ this.documentoIdentidad = data})
    this.nacionalidadService.findAll().subscribe(data =>{ this.nacionalidad = data;} )        
    this.cajaService.findAll().subscribe(data =>{ this.cajaSalud = data;} )        
    this.aporteAfpService.findAll().subscribe(data =>{ this.aporteAfp = data; console.log(data);} )   
  }
   /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    if(this.persona !=null && this.persona.idPersona >0 ){
      //UPDATE
      this.persona.fechaIngreso = moment( this.persona.fechaIngreso).format('YYYY-MM-DDTHH:mm:ss');

      this.personaService      
      .update(this.persona.idPersona, this.persona)
      .pipe(switchMap(()=>this.personaService.findAll()))
      .subscribe(data=>{
        this.personaService.setPersonaChange(data);
        this.personaService.setMessageChange("UPDATE!")
      })
    }
    else{
      //INSERT
      if(
          !this.persona.primerNombre || 
          !this.persona.primerNombre || 
          !this.persona.primerApellido || 
          !this.persona.segundoApellido ||
          !this.persona.ci ||
          !this.persona.fechaNacimiento ||
          !this.persona.cuenta ||
          !this.persona.fechaIngreso ||
          !this.persona.sueldoBase ||
          !this.persona.tipoContrato ||
          !this.persona.tipoCargo ||
          !this.persona.nacionalidad ||
          !this.persona.sucursal 
        ){
        this.messages = [{ severity: 'error', detail: 'LLENAR CAMPOS' }];
        return
      }else{
        this.persona.fechaIngreso = moment( this.persona.fechaIngreso).format('YYYY-MM-DDTHH:mm:ss');
        this.persona.fechaNacimiento= moment(this.persona.fechaNacimiento).format('YYYY-MM-DDTHH:mm:ss');


        
        this.personaService
        .save(this.persona)
        .pipe(switchMap(()=>this.personaService.findAll()))
        .subscribe(data=>{
          this.personaService.setPersonaChange(data);
          this.personaService.setMessageChange('CREATED');
    
        });
      }
    }
    
    this.close();
  }
    
  close() {
    this.ref.close();
  }

  /* onChangeClass(e: any):void{
    const isValid = e.target.value.trim()
    console.log(isValid);
    this.requiredClass = isValid?'':'ng-invalid ng-dirty';
  } */

}
