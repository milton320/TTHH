import { Rol } from "./rol";

export class Login{
    idUser?:number;
    username:String;
    password:String;
    id_persona?:number;
    roles?:Rol[];
}