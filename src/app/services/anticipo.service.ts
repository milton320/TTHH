import { Injectable } from '@angular/core';
import { Anticipo } from '../model/anticipo';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnticipoService {

  private url: string = `${environment.HOST}/detalleAnticipos`;
  private anticipoChange: Subject<Anticipo[]>= new Subject<Anticipo[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Anticipo[]>(this.url);
  }

  save(anticipo: Anticipo){
    return this.http.post(this.url, anticipo);
  }

  setAnticipoChange(data: Anticipo[]){
    this.anticipoChange.next(data);
  }

  getAnticipo(){
    return this.anticipoChange.asObservable();
  }

  delete(id:number){
    return this.http.delete<Anticipo>(`${this.url}/${id}`);
  }

  update(id:number, anticipo: Anticipo){
    return this.http.put(`${this.url}/${id}`,anticipo)

  }

  /************************** */

  getAnticipoChange(){
    return this.anticipoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
