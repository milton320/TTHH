import { PermisoLista } from "./permisoLista";
import { Persona } from "./persona";

export class Permiso{
    idPermiso:number;
    persona:Persona;
    tipoPermiso:boolean;
    tipoFechaHora:string;
    fechaDesde:string;
    fechaHasta:string;
    fechaReintegro?:string;
    diasFalta:any;
    motivo:string;
    monto:number;
    permisosLaboralesLista:PermisoLista;
    fechaHoraEstado:boolean;
    fechaRegistro?:string;
    fechaModificacion?:string;
    fechaElliminacion?:string;

    constructor(monto: number = 0) { // Valor por defecto de 0, pero puedes pasar otro valor si es necesario
        this.monto = monto;
      }
}
