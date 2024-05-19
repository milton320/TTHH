import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Sucursal } from '../model/sucursal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private url: string = `${environment.HOST}/sucursales`
  private sucursalChange: Subject<Sucursal[]>= new Subject<Sucursal[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Sucursal[]>(this.url); 
  }



  findById(id:number){
    return this.http.get<Sucursal>(`${this.url}/${id}`);
  }

  save(sucursal: Sucursal){    
    return this.http.post(this.url, sucursal);
  }

  update(id: number,sucursal: Sucursal){    
    return this.http.put(`${this.url}/${id}`, sucursal);
  }

  delete(id:number){
    return this.http.delete<Sucursal>(`${this.url}/${id}`);
  }

  /************************** */

  setSucursalChange(data: Sucursal[]){
    this.sucursalChange.next(data);
  }

  getSucursalChange(){
    return this.sucursalChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
