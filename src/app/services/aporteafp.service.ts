import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { AporteAfp } from '../model/aporteAfp';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AporteafpService  extends GenericService<AporteAfp>{

  private aportAfpChange: Subject<AporteAfp[]>= new Subject<AporteAfp[]>();
    private messageChange: Subject<string>= new Subject<string>();
  
    constructor(protected override http:HttpClient){
      super(http, `${environment.HOST}/afpaporte`)
    }
    setAporteAfpChange(data: AporteAfp[]){
        this.aportAfpChange.next(data);
      }
    
      getAporteAfpChange(){
        return this.aportAfpChange.asObservable();
      }
    
      setMessageChange(data: string){
        this.messageChange.next(data);
      }
    
      getMessageChange(){
        return this.messageChange.asObservable();
      }
}
