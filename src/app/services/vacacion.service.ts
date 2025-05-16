import { Injectable } from '@angular/core';
import { Vacacion } from '../model/vacacion';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

/*    registroVacaciones(vacacion: Vacacion){
    return this.http.post(`${this.url}/persona/registrarVacacion`, vacacion)
   }

// Método para calcular los días disponibles para una persona
  calcularDiasDisponibles(idPersona: number){
    return this.http.get<number>(`${this.url}/persona/${idPersona}/diasDisponibles`);
  } */

  deleteLogic(id:number, vacacion: Vacacion){
    return this.http.put<Vacacion>(`${this.url}/eliminarLogica/${id}`, vacacion);
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
