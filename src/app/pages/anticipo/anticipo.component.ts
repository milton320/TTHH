import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from '../../material/material.module';
import { Persona } from '../../model/persona';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Anticipo } from '../../model/anticipo';
import { AnticipoService } from '../../services/anticipo.service';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnticipoDialogComponent } from './anticipo-dialog/anticipo-dialog.component';
import { switchMap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-anticipo',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './anticipo.component.html',
  styleUrl: './anticipo.component.css'
})
export class AnticipoComponent implements OnInit {
  username: string
  role: string
  idPersona: number
  anticipo!: Anticipo[]
  loading: boolean = true;
  ref: DynamicDialogRef
  anticipoPorPersona:any;
  mostrarAcciones = false;

  

  constructor(
    private anticipoService: AnticipoService,
    private personaService: PersonaService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ){}

  ngOnInit(): void 
  {  
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.role = decodedToken.role;
    this.idPersona = decodedToken.idPersona;
    
    this.anticipoService.findAll().subscribe(data =>
    {
      this.anticipo = data
    });

    this.anticipoService.anticiposPorPersona(this.username).subscribe(data=>{
      this.anticipoPorPersona = data
    })

    this.anticipoService.getMessageChange().subscribe(data=>
    {
      if(data == 'CREATED')
      {
        this.messageService.add({ severity: 'success', summary: 'REGISTRADO', detail: 'Agregado Correctamente' });
        this.updateTable()
      }
      else if(data == 'UPDATE!')
      {
        this.messageService.add({ severity: 'info', summary: 'ACTUALIZADO', detail: 'Actualizado Correctamente' });
        this.updateTable()
      }
      else if(data == 'DELETE!'){
        this.messageService.add({ severity: 'error', summary: 'ELIMINADO', detail: 'Eliminacion Correctamente' });
        this.updateTable()
      }else if(data == 'ERROR!'){
        this.messageService.add({ severity: 'warn', summary: 'ATENCION', detail: 'Error. Intente nuevamente' });
        this.updateTable()
      }
      else if(data == 'LOAD!'){
        this.messageService.add({ severity: 'secondary', summary: 'CARGA DE DATOS', detail: 'Carga de datos correctamente' });
        this.updateTable()
      }
    
    })        
    
    
  }

  
  updateTable(){
    this.anticipoService.findAll().subscribe(data => {
      this.anticipo = data
    });
  }
  
  showDialog(anticipo?: Anticipo){
    this.ref = this.dialogService.open(AnticipoDialogComponent, {
      header: 'ANTICIPOS',
      data: anticipo,
      modal:true,
      contentStyle: { overflow: 'auto' },
      
    })  
  }
  
  confirm2(event: Event, idAnticipo:any) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Quieres Eliminar este registro?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.delete(idAnticipo)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
        }
    });
  }
  delete(idAnticipo:any){
    this.anticipoService.delete(idAnticipo)
    .pipe(switchMap(()=>this.anticipoService.findAll()))
    .subscribe(data=>{
      this.anticipoService.setAnticipoChange(data);
      this.anticipoService.setMessageChange('DELETE!');
    })
  }
}
