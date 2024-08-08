import { Persona } from "./persona";

export class Vacacion{
    idVacacion:number;
    persona:Persona;
    fechaDesde:string;
    fechaHasta:string;
    fechaReintegro:string;
    diasFalta: number;
    fechaRegistro?:string;
}