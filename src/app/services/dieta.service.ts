import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Dieta } from '../model/dieta';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DietaService {

  
  private url:string = `${environment.HOST}/salarioDietas`;
  private dietaChange: Subject<Dieta[]>=new Subject<Dieta[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) { 
    
  }
  findAll(){
    return this.http.get<Dieta[]>(this.url);
  }

  save(dieta: Dieta){
    return this.http.post(this.url, dieta)
  }
  setDietaChange(data: Dieta[]){
    this.dietaChange.next(data);
  }

  delete(id:number){
    return this.http.delete<Dieta>(`${this.url}/${id}`);
  }

  update(id:number, dieta: Dieta){
    return this.http.put(`${this.url}/${id}`,dieta)

  }
  /***** */

  saveDietaChange(data: Dieta[]){
    this.dietaChange.next(data);
  }

  getDietaChange(){
    return this.dietaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }


}
