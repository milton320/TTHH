import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { JusAtraso } from '../model/jusAtraso';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { JustificativoFalta } from '../model/justificativoFalta';

@Injectable({
  providedIn: 'root'
})
export class FaltaService extends GenericService<JustificativoFalta> {

  private faltaChange: Subject<JustificativoFalta[]> = new Subject<JustificativoFalta[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http:HttpClient) { 
    super(http, `${environment.HOST}/detalleDescuentosFaltas`)
  }

  mesesAnios(mes:number, anio:number){
    return this.http.get<any>(`${environment.HOST}/detalleDescuentosFaltas/mesAnios?mes=${mes}&anio=${anio}`);
  }

  setJustificadoFaltaChange(data: JustificativoFalta[]){
    this.faltaChange.next(data);
  }

  getJustificadoFaltaChange(){
    return this.faltaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

