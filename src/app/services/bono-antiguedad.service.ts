import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { BonoAntiguedad } from '../model/bonoAntiguedad';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BonoAntiguedadService extends GenericService<BonoAntiguedad>{
  private bonAntiguedadChange: Subject<BonoAntiguedad[]>= new Subject<BonoAntiguedad[]>();
  private messageChange: Subject<string>= new Subject<string>();
  constructor(protected override http:HttpClient) { 
    super(http, `${environment.HOST}/bonosAntiguedad`)

    }
    setBonoAntiguedadChange(data: BonoAntiguedad[]){
      this.bonAntiguedadChange.next(data);
    }
  
    getBonoAntiguedadChange(){
      return this.bonAntiguedadChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
  
}
