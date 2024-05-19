import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sucursal } from '../../../model/sucursal';
import { FormsModule } from '@angular/forms';
import { SucursalService } from '../../../services/sucursal.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sucursal-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterOutlet,RouterLink,FormsModule],
  templateUrl: './sucursal-dialog.component.html',
  styleUrl: './sucursal-dialog.component.css'
})
export class SucursalDialogComponent implements OnInit {
  sucursal: Sucursal;

  constructor( 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private sucursalService: SucursalService
    
  )
  {}

  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.config.data)
    this.sucursal = {...this.config.data}


    if(this.sucursal != null && this.sucursal.idSucursal > 0){
      console.log('UPDATE')
    }
    else
    {
      this.sucursal.fechaRegistro = new Date();
    }
  }


  
  /**REGISTRAR ACTUALIZAR */ 
  operate(){
    
    if(this.sucursal !=null && this.sucursal.idSucursal >0 ){
      //UPDATE
      this.sucursalService
      .update(this.sucursal.idSucursal, this.sucursal)
      .pipe(switchMap(()=>this.sucursalService.findAll()))
      .subscribe(data=>{
        this.sucursalService.setSucursalChange(data);
        this.sucursalService.setMessageChange("UPDATE!")
      })
    }
    else{
    //INSERT
    
    this.sucursalService
    .save(this.sucursal)
    .pipe(switchMap(()=>this.sucursalService.findAll()))
    .subscribe(data=>{
      this.sucursalService.setSucursalChange(data);
      this.sucursalService.setMessageChange('CREATED');

    });
    
    }
    this.close();
  }
  
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  close() {
    this.ref.close();
  }
}
