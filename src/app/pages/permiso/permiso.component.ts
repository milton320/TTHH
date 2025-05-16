import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { PermisoDialogComponent } from './permiso-dialog/permiso-dialog.component';
import { Permiso } from '../../model/permiso';
import { PermisoService } from '../../services/permiso.service';
import { switchMap } from 'rxjs';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { PermisolistaService } from '../../services/permisolista.service';
import { PermisoLista } from '../../model/permisoLista';

@Component({
  selector: 'app-permiso',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule,RouterOutlet,RouterLink ],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './permiso.component.html',
  styleUrl: './permiso.component.css'
})
export class PermisoComponent implements OnInit {
  permiso!: Permiso[]
  permisoListaM!: PermisoLista[]

  //loading: boolean = true;
  ref: DynamicDialogRef 
  es: any;
  constructor(
    private personaService: PersonaService,
    private permisoService: PermisoService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private permisoListaService: PermisolistaService,
    private primengConfig: PrimeNGConfig
    ){}

    ngOnInit(): void 
    {  

      this.permisoListaService.findAll().subscribe(data=>{
        this.permisoListaM = data
        
      })
      
      this.permisoService.findAll().subscribe(data =>
      {
        this.permiso = data
      });
  
      this.permisoService.getMessageChange().subscribe(data=>
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
        }
      
      })    
      this.es = {
        firstDayOfWeek: 1,
        dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
        dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
        dayNamesMin: [ "D","L","M","X","J","V","S" ],
        monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
        monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
        today: 'Hoy',
        clear: 'Borrar'
      }
      this.primengConfig.setTranslation(this.es)    
    }
    updateTable(){
      this.permisoService.findAll().subscribe(data => {
        this.permiso = data
      });
    }
    
    showDialog(permiso?: Permiso){
      if(permiso == null){
        this.ref = this.dialogService.open(PermisoDialogComponent, {
          header: 'PERMISO ',
          data: permiso,
          modal:true,
          width: '35vw',
          maximizable:true,
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        })  
      
      }else{
        this.ref = this.dialogService.open(PermisoDialogComponent, {
          header: 'ACTUALIZAR PERMISO',
          data: permiso,
          modal:true,
          maximizable:true,
        })  
      }
    }
    confirm2(event: Event, idPermiso:any) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Quieres Elminar este registro?',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          accept: () => {
              
              this.delete(idPermiso)
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
          }
      });
    }
    delete(idPermiso:any){
      this.permisoService.delete(idPermiso)
      .pipe(switchMap(()=>this.permisoService.findAll()))
      .subscribe(data=>{
        this.permisoService.setPermisoChange(data);
        this.permisoService.setMessageChange('DELETE!');
      })
    }
 

}
