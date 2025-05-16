import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Atraso } from '../model/atraso';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtrasoService  extends GenericService<Atraso>{

  private urlP: string =`${environment.HOST}/tempAtrasos` 
  private atrasoChange: Subject<Atraso[]>=new Subject<Atraso[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/atrasosService`)
   }


  //REGISTRAR desde atraso component 
  saveOtherAtraso(atraso: Atraso){
    return this.http.post(this.urlP, atraso)
  }
  
  //llamada desde atraso component 
  findAllOtherAtraso(){
    return this.http.get<Atraso[]>(this.urlP); 
  }

  //llamada a mesAnioAll

  findMesAnioAtraso(){
    return this.http.get<any>(`${this.urlP}/mesAnioAll`); 
  }
  
  saveExterno(){
    return this.http.get<Atraso[]>(`${this.url}/transferirDatos`)
  }

  setAtrasoChange(data: Atraso[]){
    this.atrasoChange.next(data);
  }

  getAtrasoChange(){
    return this.atrasoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
