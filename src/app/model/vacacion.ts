import { Persona } from "./persona";

export class Vacacion{
    idVacacion:number;
    persona:Persona;
    fechaDesde:Date;
    fechaHasta:Date;
    fechaReintegro:Date;
    diasFalta:String;
    fechaRegistro:Date;
}