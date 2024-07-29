import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Dieta } from '../model/dieta';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class DietaService extends GenericService<Dieta>{

  
  /* private url:string = `${environment.HOST}/salarioDietas`; */
  private dietaChange: Subject<Dieta[]>=new Subject<Dieta[]>();
  private messageChange: Subject<string>= new Subject<string>();


  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/salarioDietas`);
  }

  /***** */

  setDietaChange(data: Dieta[]){
    this.dietaChange.next(data);
  }

  getDietaChange(){
    return this.dietaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }


}
