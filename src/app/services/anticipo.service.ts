import { Injectable } from '@angular/core';
import { Anticipo } from '../model/anticipo';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class AnticipoService extends GenericService<Anticipo> {

  /* private url: string = `${environment.HOST}/detalleAnticipos`; */
  private anticipoChange: Subject<Anticipo[]>= new Subject<Anticipo[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http:HttpClient){
    super(http, `${environment.HOST}/detalleAnticipos`)
  }



  /************************** */


  setAnticipoChange(data: Anticipo[]){
    this.anticipoChange.next(data);
  }

  getAnticipoChange(){
    return this.anticipoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
