import { AporteAfp } from "./aporteAfp";
import { CajaSalud } from "./cajaSalud";
import { DocumentoIdentidad } from "./documentoIdentidad";
import { Nacionalidad } from "./nacionalidad";
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
    totalVacacionUs?: number;
    sucursal:Sucursal;
    fechaRegistro?:string;
    fechaActualizacion?:string;
    estado:boolean;
    vacacionPersona?: number; 
    bonoAntiguedad?:number;
    aniosAtiguedad?:number;
    mesesAtiguedad?:number;
    diasAtiguedad?:number;
    documentoIdentidad: DocumentoIdentidad;
    nacionalidad:Nacionalidad;
    cajaSalud:CajaSalud;
    aporteAfp:AporteAfp;

    constructor(){
        this.totalVacacion = 0;
        this.totalVacacionUs = 0;
    }
}