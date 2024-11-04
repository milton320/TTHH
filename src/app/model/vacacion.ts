import { Persona } from "./persona";

export class Vacacion{
    idVacacion:number;
    persona:Persona;
    fechaDesde:string;
    fechaHasta:string;
    descripcion:string;
    diasVacacionAcumulados?:number;
    diasVacacionUsados?:number;
    diasVacacionDisponibles?:number;
    diasFalta: number;
    fechaRegistro?:string;
}