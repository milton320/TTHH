import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { MaterialModule } from '../material/material.module';
import { LoginService } from '../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Login } from '../model/login';
import { lastValueFrom, switchMap } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,PasswordModule,RouterLink,ToastModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginData: Login;
  username:string
  password:string
  id_persona:number
  messages: Message[] | undefined;
  data:any

  constructor(
    private loginService : LoginService,
    private router: Router,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    this.loginService.getMessageChange().subscribe(data=>{
      
      if(data == 'CREATED')
        {
          this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'UPDATE!')
        {
          this.messageService.add({ severity: 'info', summary: 'ACTUALIZADO', detail: 'Actualizado Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'DELETE!'){
          this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
          /* this.updateTable() */
        }
        else if(data == 'ERROR!'){
          this.messageService.add({ severity: 'warn', summary: 'ATENCION', detail: 'Error de Conexion' });
          /* this.updateTable() */
        }
        else if(data == 'LOAD!'){
          this.messageService.add({ severity: 'contrast', summary: 'CARGA DE DATOS', detail: 'Carga de datos correctamente' });
          /* this.updateTable() */
        }

    })
  
    
  }

  

  login(){

    if(!this.username || !this.password){
      this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Por favor, ingrese usuario y contraseña', life: 3000 })
      return;
    }
    
    this.loginService.login(this.username, this.password).subscribe(
     {
      next: (data)=>{
      
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['pages/dashboard']);
     }, 
     error:(e)=>{
      let errorMessage = 'Error de autenticación';
      if(e.status == 401){
        errorMessage = 'Credenciales inválidas';
      }else if(e.status == 500){
        errorMessage = 'Credenciales inválidas.';
      }
      this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: errorMessage, life: 3000 });
     }
    
    }
  
  )
    
     

  }
/*   insert(){
  
    //INSERT
    this.loginData = {username:this.username, password:this.password};
    this.loginService
    .save(this.loginData).subscribe(data=>{
      console.log(data)
    });

  } */
    

    async insert() {
      // Validación de campos
      if (!this.username || !this.password) {
        this.messageService.add({ severity: 'warn', summary: 'Campos Vacíos', detail: 'Debe completar todos los campos' });
        return;
      }
    
      // Creación de datos de login
      this.loginData = { username: this.username, password: this.password};
    
      try {
        const response = await lastValueFrom(this.loginService.save(this.loginData));
        
        this.loginService.setMessageChange('CREATED')
      } catch (error) {
        
        this.messageService.add({ severity: 'error', summary: 'Error en Registro', detail: 'No se pudo registrar el usuario' });
      }
    }
    
}

