import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Persona } from '../model/persona';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url: string= `${environment.HOST}/personas`;
  private urlP: string ='https://660a18fd0f324a9a288425d8.mockapi.io/api/v1/personas'
  private personaChange: Subject<Persona[]>= new Subject<Persona[]>();
  private messageChange: Subject<string>= new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Persona[]>(this.url); 
  }

  findAllPersona<Persona>(){
    return new Promise ((resolve, reject )=>{
      this.http.get<Persona[]>(this.urlP).subscribe(data=>resolve(data)); 
    })
  }

  savePersonas(persona: Persona){
    return this.http.post(this.url, persona)
  }

  save(persona: Persona){
    return this.http.post(this.url, persona)
  }

  delete(id:number){
    return this.http.delete<Persona>(`${this.url}/${id}`);
  }

  update(id:number, personal: Persona){
    return this.http.put(`${this.url}/${id}`,personal)

  }

  /******************* */
  setPersonaChange(data: Persona[]){
    this.personaChange.next(data);
  }

  getPersonaChange(){
    return this.personaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
