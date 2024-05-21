import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Permiso } from '../model/permiso';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private url:string = `${environment.HOST}/detallePermisos`;
  private permisoChange: Subject<Permiso[]>=new Subject<Permiso[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) {}

  findAll(){
    return this.http.get<Permiso[]>(this.url);
  }

  save(permiso: Permiso){
    return this.http.post(this.url, permiso)
  }
  setPermisoChange(data: Permiso[]){
    this.permisoChange.next(data);
  }

  delete(id:number){
    return this.http.delete<Permiso>(`${this.url}/${id}`);
  }

  update(id:number, permiso: Permiso){
    return this.http.put(`${this.url}/${id}`,permiso)

  }

  /***** */

  savePermisoChange(data: Permiso[]){
    this.permisoChange.next(data);
  }

  getPermisoChange(){
    return this.permisoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
