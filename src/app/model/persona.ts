import { Sucursal } from "./sucursal";
import { TipoCargo } from "./tipoCargo";
import { TipoContrato } from "./tipoContrato";

export class Persona{
    idPersona: number;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    ci: string;
    genero: string;
    fechaNacimiento: string;
    cuenta: string;
    fechaIngreso: string;
    sueldoBase: number;
    tipoContrato: TipoContrato;
    tipoCargo: TipoCargo;
    totalVacacion: number;
    totalVacacionUs: number;
    nacionalidad:string
    sucursal:Sucursal;
    fechaRegistro?:string;
    fechaActualizacion?:string;
    estado:boolean;

    constructor(){
        this.totalVacacion = 0;
        this.totalVacacionUs = 0
    }
}