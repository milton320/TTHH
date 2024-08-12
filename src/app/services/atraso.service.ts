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

  private urlP: string ='http://localhost:8080/tempAtrasos' 
  private atrasoChange: Subject<Atraso[]>=new Subject<Atraso[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/atrasosService`)
   }

   saveOtherAtraso(atraso: Atraso){
    return this.http.post(this.urlP, atraso)
  }
  findAllOtherAtraso(){
    return this.http.get<Atraso[]>(this.urlP); 
  }


   setDietaChange(data: Atraso[]){
    this.atrasoChange.next(data);
  }

  getDietaChange(){
    return this.atrasoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
