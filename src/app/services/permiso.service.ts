import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Permiso } from '../model/permiso';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PermisoService extends GenericService<Permiso>{

  /* private url:string = `${environment.HOST}/detallePermisos`; */
  private permisoChange: Subject<Permiso[]>=new Subject<Permiso[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http:HttpClient) {
    super(http, `${environment.HOST}/detallePermisos`);
  }


  /***** */

  setPermisoChange(data: Permiso[]){
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
