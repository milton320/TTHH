import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TipoCargo } from '../model/tipoCargo';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoCargoService extends GenericService<TipoCargo>{

  private tipoCargoChange: Subject<TipoCargo[]> = new Subject<TipoCargo[]>();
  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/tipoCargos`)
  }
  setTipoCargoChange(data: TipoCargo[]){
    this.tipoCargoChange.next(data);
  }

  getTipoCargoChange(){
    this.tipoCargoChange.asObservable();
  }
}
