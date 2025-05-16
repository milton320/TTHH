import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RolService } from '../../../services/rol.service';
import { Rol } from '../../../model/rol';
import { LoginService } from '../../../services/login.service';
import { Login } from '../../../model/login';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usurario-modal',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,FloatLabelModule],
   
  templateUrl: './usurario-modal.component.html',
  styleUrl: './usurario-modal.component.css'
})
export class UsurarioModalComponent  implements OnInit{
  usuario:Login 
  username:string
  password:string
  roles:Rol[]
  
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private rolService: RolService,
    private loginService : LoginService,
     private messageService: MessageService,
    private usuarioService: UsuarioService

  ){}
  ngOnInit(): void {
    this.usuario = {...this.config.data}

    this.rolService.findAll().subscribe(data =>{
      this.roles = data;
      
    })
    
  }


    
  operate() {
    
  
    // Verificar y transformar roles si no es un array
    if (this.usuario.roles && !Array.isArray(this.usuario.roles)) {
      this.usuario.roles = [this.usuario.roles];
    }
  
    this.loginService.save(this.usuario).subscribe(
      {
        next:(data)=>{
    
        },
        error:(e)=> {
    
        },
        complete:()=>{
          
          this.usuarioService.setMessageChange('CREATED');
          this.close(); // Cerrar después de la actualización
        }
      }
    );
  }
  close() {
    this.ref.close();
  }

}
