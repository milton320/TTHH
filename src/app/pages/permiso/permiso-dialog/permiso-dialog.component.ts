import { Component, OnInit } from '@angular/core';
import { Permiso } from '../../../model/permiso';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../../services/persona.service';
import { SucursalService } from '../../../services/sucursal.service';
import { Persona } from '../../../model/persona';
import { switchMap } from 'rxjs';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-permiso-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule,FloatLabelModule],
  templateUrl: './permiso-dialog.component.html',
  styleUrl: './permiso-dialog.component.css'
})
export class PermisoDialogComponent implements OnInit{

  permiso: Permiso

  persona:Persona[];

  MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  valorTipo = 'SI'




  diferenciaEntreDiasEnDias(a, b)
  {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(),);
  
    return Math.floor((utc2 - utc1) / this.MILISENGUNDOS_POR_DIA);
  }
  dia1 = new Date();
  dia2 = new Date();
  
  resultado = this.diferenciaEntreDiasEnDias(this.dia1, this.dia2);
  

  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private personaService: PersonaService,
    private permisoService: PermisoService,
    
  )
  {}
  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.permiso = {...this.config.data}

    
    if(this.permiso != null && this.permiso.idPermiso > 0){
      console.log('UPDATE')
    }
    else
    {
      this.permiso.fechaRegistro = new Date();
    }


  
    this.personaService.findAll().subscribe(data =>{this.persona = data});
  }

  /**REGISTRAR ACTUALIZAR */ 
  operate()
  {
    console.log('save');
    if(this.permiso !=null && this.permiso.idPermiso >0 ){
      //UPDATE
      let ts = this.diferenciaEntreDiasEnDias(this.permiso.fechaDesde, this.permiso.fechaHasta);
      this.permiso.diasFalta = parseInt(ts.toString()) + 1;
      console.log(ts.toString());
      this.permisoService
      .update(this.permiso.idPermiso, this.permiso)
      .pipe(switchMap(()=>this.permisoService.findAll()))
      .subscribe(data=>{
        this.permisoService.setPermisoChange(data);
        this.permisoService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    let ts = this.diferenciaEntreDiasEnDias(this.permiso.fechaDesde, this.permiso.fechaHasta);
    this.permiso.diasFalta = parseInt(ts.toString()) + 1;
    console.log(ts.toString());
    this.permisoService
    .save(this.permiso)
    .pipe(switchMap(()=>this.permisoService.findAll()))
    .subscribe(data=>{
      this.permisoService.setPermisoChange(data);
      this.permisoService.setMessageChange('CREATED');
      
    });
    }
    this.close();
  }
     
  close() {
    this.ref.close();
  }

}
