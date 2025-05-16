import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, Subject } from 'rxjs';
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

  callPlanilla(){
    return this.http.get<any>(`${this.url}/planilla`,{ responseType: 'text' as 'json' });
  }

  getPlanilla(){
    return this.planillaChange.asObservable();
  }

  aguinaldoReportpdf(){
    return this.http.get(`${this.url}/aguinaldoReport`, { responseType:'blob' }); 
  }
  generateReportPDF(username:String){
    return this.http.get(`${this.url}/planillaReport?username=${username}`, { responseType:'blob' }); 
  }

  generateReportXL(){
    return this.http.get(`${this.url}/xls`, { responseType:'blob' }); 
  }
  
  generateReportTxt(){
    return this.http.get(`${this.url}/txt`, { responseType:'blob' }); 
  }

  boletaReportTxt(idPersona:number, username:String){
    return this.http.get(`${this.url}/pago/pdf?idPersona=${idPersona}&username=${username}`, { responseType:'blob' }); 
  }
    /* boletaPagoPDF(idPersona: number) {
      return this.http.get(`${this.url}/pago/pdf?/${idPersona}`,{responseType:'blob'})
    } */
    
  /*PLANILLLA EVENTUAL PDF */
  generateReportPDFEventual(username:String){
    return this.http.get(`${this.url}/planillaReportEventual?username=${username}`, { responseType:'blob' }); 
  }


}
