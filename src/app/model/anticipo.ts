import { Persona } from "./persona";

export class Anticipo{
    idAnticipo:number;
    monto:number;
    descripcion:String;
    fechaRegistro:string;
    /* fechaAnticipo:string; */
    persona: Persona;
    estado:boolean;
}