import { Sucursal } from "./sucursal";

export class Persona{
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    ci: string;
    genero: string;
    fechaNacimiento: Date;
    cuenta: string;
    fechaIngreso: Date;
    fechaRetiro: Date;
    tipoContrato: string;
    cargo: string;
    sueldoBase: number;
    idPersona: number;
    idSucursal: number;
    sucursal?:Sucursal;
    fechaRegistro?:Date;
    fechaActualizacion?:Date;
}