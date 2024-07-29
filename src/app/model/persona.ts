import { Sucursal } from "./sucursal";

export class Persona{
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    ci: string;
    genero: string;
    fechaNacimiento: string;
    cuenta: string;
    fechaIngreso: string;
    fechaRetiro: string;
    tipoContrato: string;
    cargo: string;
    sueldoBase: number;
    idPersona: number;
    idSucursal: number;
    sucursal?:Sucursal;
    fechaRegistro?:string;
    fechaActualizacion?:string;
}