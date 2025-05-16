import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { DocumentoIdentidad } from '../model/documentoIdentidad';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class DocumentoService extends GenericService<DocumentoIdentidad>{
  
  private documentoChange: Subject<DocumentoIdentidad[]> = new Subject<DocumentoIdentidad[]>();
  private messageChange: Subject<string>= new Subject<string>();
  constructor(protected override http:HttpClient) {
    super(http, `${environment.HOST}/documentos`)
   }

     setDocumentoChange(data: DocumentoIdentidad[]){
       this.documentoChange.next(data);
     }
   
     getDocumentoChange(){
       return this.documentoChange.asObservable();
     }
   
     setMessageChange(data: string){
       this.messageChange.next(data);
     }
   
     getMessageChange(){
       return this.messageChange.asObservable();
     }
   
}
