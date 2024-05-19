import { Injectable } from '@angular/core';
import { Vacacion } from '../model/vacacion';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacacionService {

  private url:string = `${environment.HOST}/detalleVacaciones`;
  private vacacionChange: Subject<Vacacion[]>=new Subject<Vacacion[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Vacacion[]>(this.url);
  }

  save(vacacion: Vacacion){
    return this.http.post(this.url, vacacion)
  }
  setVacionChange(data: Vacacion[]){
    this.vacacionChange.next(data);
  }

  delete(id:number){
    return this.http.delete<Vacacion>(`${this.url}/${id}`);
  }

  update(id:number, vacacion: Vacacion){
    return this.http.put(`${this.url}/${id}`,vacacion)

  }
  /***** */

  saveVacionChange(data: Vacacion[]){
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
