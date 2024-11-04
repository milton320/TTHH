import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Planilla } from '../model/planilla';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService extends GenericService<Planilla>{

  private planillaChange: Subject<Planilla[]> = new Subject<Planilla[]>();
  constructor(protected override http: HttpClient) { 
    super(http, `${environment.HOST}/planillas`)
  }

  setPlanillaChange(data: Planilla[]){
    this.planillaChange.next(data);
  }

  getPlanilla(){
    return this.planillaChange.asObservable();
  }
  aguinaldoReportpdf(){
    return this.http.get(`${this.url}/aguinaldoReport`, { responseType:'blob' }); 
  }
  generateReportPDF(){
    return this.http.get(`${this.url}/planillaReport`, { responseType:'blob' }); 
  }
  generateReportXL(){
    return this.http.get(`${this.url}/xls`, { responseType:'blob' }); 
  }
  generateReportTxt(){
    return this.http.get(`${this.url}/txt`, { responseType:'blob' }); 
  }
  boletaReportTxt(idPersona:number){
    return this.http.get(`${this.url}/pago/pdf?idPersona=${idPersona}`, { responseType:'blob' }); 
  }


}
