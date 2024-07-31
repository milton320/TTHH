import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Prestamo } from '../model/prestamo';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService extends GenericService<Prestamo>{

  private prestamoChange: Subject<Prestamo[]> = new Subject<Prestamo[]>();
  private messageChange: Subject<string> = new Subject<string>();
  constructor(protected override http:HttpClient)
  {
    super(http, `${environment.HOST}/detallePrestamos`)
  }

  /************************** */


  setPrestamoChange(data: Prestamo[]){
    this.prestamoChange.next(data);
  }

  getPrestamoChange(){
    return this.prestamoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
