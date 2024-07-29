import { Persona } from "./persona";

export class Permiso{
    idPermiso:number;
    persona:Persona;
    tipoPermiso:boolean;
    fechaDesde:string;
    fechaHasta:string;
    fechaReintegro:string;
    diasFalta:any;
    estadoPermiso: boolean;
    motivo:string;
    monto:number;
    fechaRegistro?:string;
    fechaModificacion?:string;
    fechaElliminacion?:string;

    constructor(){
        this.monto = 0
    }
}
