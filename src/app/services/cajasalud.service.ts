import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { CajaSalud } from '../model/cajaSalud';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CajasaludService extends GenericService<CajaSalud> {
  private cajaSaludChange: Subject<CajaSalud[]>= new Subject<CajaSalud[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(protected override http:HttpClient){
    super(http, `${environment.HOST}/cajasalud`)
  }

    setCajaSaludChange(data: CajaSalud[]){
      this.cajaSaludChange.next(data);
    }
  
    getCajaSaludChange(){
      return this.cajaSaludChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
  
}
