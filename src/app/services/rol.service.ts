import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Rol } from '../model/rol';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  /* private url:string = `${environment.HOST}/salarioDietas`; */
    private rolChange: Subject<Rol[]>=new Subject<Rol[]>();
    private messageChange: Subject<string>= new Subject<string>();
  
  constructor(protected override http: HttpClient){
      super(http, `${environment.HOST}/roles`);
    }


  /***** */

  setRolChange(data: Rol[]){
    this.rolChange.next(data);
  }

  getRolChange(){
    return this.rolChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
