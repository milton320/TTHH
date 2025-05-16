import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Login } from '../model/login';
import { Subject } from 'rxjs';
import { InfoPersona } from '../model/infoPersona';

interface ILoginRequest{
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string = `${environment.HOST}/login`
  private url2: string = `${environment.HOST}`
  private messageChange: Subject<string>= new Subject<string>();

  constructor(
    private http:HttpClient,
    private router:Router
  ) { }

  login(username: string, password:string){
    const body: ILoginRequest = {username, password};
    return this.http.post<any>(this.url, body)
  }

  save(login: Login){
    return this.http.post( `${this.url2}/register`, login)
  }

  userInformacion(username: String){
    return this.http.get<InfoPersona>(`${this.url2}/usuarioInformacion?username=${username}`);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login'])
  }
  
  islogged(){
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }
  
  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

