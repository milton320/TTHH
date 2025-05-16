import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { JusAtraso } from '../model/jusAtraso';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JustificativoAtrasoService extends GenericService<JusAtraso>{
  private justificadoAtrasoChange: Subject<JusAtraso[]> = new Subject<JusAtraso[]>();
  private urlP: string ='http://localhost:8080/tempAtrasos' 
  private messageChange: Subject<string> = new Subject<string>();

  constructor( protected override http:HttpClient) {
    super(http, `${environment.HOST}/detalleDescuentosAtrasos`)
   }

   /************************** */
    findAllOtherAtraso(){
       return this.http.get<JusAtraso[]>(this.urlP); 
     }
     


  setJustificativoAtrasoChange(data: JusAtraso[]){
    this.justificadoAtrasoChange.next(data);
  }

  getJustificativoAtrasoChange(){
    return this.justificadoAtrasoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
