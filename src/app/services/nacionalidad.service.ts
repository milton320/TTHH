import { Injectable } from '@angular/core';
import { Nacionalidad } from '../model/nacionalidad';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class NacionalidadService  extends GenericService<Nacionalidad> {
 private nacionalidadChange: Subject<Nacionalidad[]> = new Subject<Nacionalidad[]>();
  private messageChange: Subject<string>= new Subject<string>();
  
  constructor(protected override http:HttpClient){
    super(http, `${environment.HOST}/nacionalidad`)
  }
   setAnticipoChange(data: Nacionalidad[]){
      this.nacionalidadChange.next(data);
    }
  
    getAnticipoChange(){
      return this.nacionalidadChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
}
