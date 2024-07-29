import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Sucursal } from '../model/sucursal';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalService extends GenericService<Sucursal>{
  /* private url: string = `${environment.HOST}/sucursales` */
  private sucursalChange: Subject<Sucursal[]>= new Subject<Sucursal[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http:HttpClient){
    super(http, `${environment.HOST}/sucursales`);
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
