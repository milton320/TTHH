import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TipoContrato } from '../model/tipoContrato';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService extends GenericService<TipoContrato>{
  
  private  tipoContratoChange:Subject<TipoContrato[]> = new Subject<TipoContrato[]>
  
  constructor(protected override http:HttpClient) {
    super(http, `${environment.HOST}/tipoContrato`)
  }

  getCantidadContratos(){
    return this.http.get<any>(`${this.url}/cantidadContratos`)
  }

  setTipoContratoChange(data: TipoContrato[]){
    this.tipoContratoChange.next(data);
  }

  getTipoContratoChange(){
    return this.tipoContratoChange.asObservable();
  }
}
