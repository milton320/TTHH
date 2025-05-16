import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService  
{
  private url: string = `${environment.HOST}`
  private usuarioChange: Subject<Usuario[]>= new Subject<Usuario[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http:HttpClient,) { 
    
  }

  findAllLogin(){
    return this.http.get<any>(`${this.url}/listaUsuario`);
  }

  

  /***Registrar un nuevo usuario */
  save(login: Usuario){
    return this.http.post( `${this.url}/register`, login)
  }

  setUsuarioChange(data: Usuario[]){
    this.usuarioChange.next(data);
  }

  getUsuarioChange(){
    return this.usuarioChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  

  
}
