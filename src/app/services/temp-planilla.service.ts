import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TempPlanilla } from '../model/tempPlanilla';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TempPlanillaService extends GenericService<TempPlanilla>{
  private planillaChange: Subject<TempPlanilla[]> = new Subject<TempPlanilla[]>();
  constructor(protected override http: HttpClient) { 
    super(http, `${environment.HOST}/tempPlanillas`)
  }
  
  insertarTempPlaniia(){
    return this.http.get(`${this.url}/insertarPlanilla`)
  }
  
  setPlanillaChange(data: TempPlanilla[]){
    this.planillaChange.next(data);
  }

  getPlanilla(){
    return this.planillaChange.asObservable();
  }
}
