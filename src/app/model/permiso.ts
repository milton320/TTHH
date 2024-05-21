import { Persona } from "./persona";

export class Permiso{
    idPermiso:number;
    persona:Persona;
    tipoPermiso:boolean;
    fechaDesde:Date;
    fechaHasta:Date;
    fechaReintegro:string;
    diasFalta:any;
    estadoPermiso: boolean;
    motivo:string;
    monto:number;
    fechaRegistro?:Date;
    fechaModificacion?:string;
    fechaElliminacion?:string;

    constructor(){
        this.monto = 0
    }
}
