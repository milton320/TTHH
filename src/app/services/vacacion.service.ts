import { Injectable } from '@angular/core';
import { Vacacion } from '../model/vacacion';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VacacionService extends GenericService<Vacacion>{

  /* private url:string = `${environment.HOST}/detalleVacaciones`; */
  private vacacionChange: Subject<Vacacion[]>=new Subject<Vacacion[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http: HttpClient) {
    super( http, `${environment.HOST}/detalleVacaciones`)
   }


  /***** */

  setVacionChange(data: Vacacion[]){
    this.vacacionChange.next(data);
  }
  getVacionChange(){
    return this.vacacionChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
