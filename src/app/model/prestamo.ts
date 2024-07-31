import { Persona } from "./persona";

export class Prestamo{
    idPrestamo:number;
    persona:Persona ;
    importe:number;
    tipoPrestamo:string;
    descripcion:string;
    fechaRegistro?:string;
    fechaActualizacion?:string;
    fechaEliminacion?:string;
}