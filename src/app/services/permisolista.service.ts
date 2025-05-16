import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { PermisoLista } from '../model/permisoLista';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisolistaService extends GenericService<PermisoLista>{  
  private permisolistaChange: Subject<PermisoLista[]> = new Subject<PermisoLista[]>();
  
  constructor(protected override  http:HttpClient) { 
    super(http, `${environment.HOST}/planillaLista`);
  }

  setPermisoLista(data: PermisoLista[]){
    this.permisolistaChange.next(data)
  }

  getPermisoLista(){
    return this.permisolistaChange.asObservable();
  }

}
