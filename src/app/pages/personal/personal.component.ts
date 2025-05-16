import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Persona } from '../../model/persona';
import { PersonaService } from '../../services/persona.service';
import { DialogModule } from 'primeng/dialog';
import { SucursalService } from '../../services/sucursal.service';
import { MaterialModule } from '../../material/material.module';
import { PersonalDialogComponent } from './personal-dialog/personal-dialog.component';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { TempPlanillaService } from '../../services/temp-planilla.service';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { IncrementoComponent } from './incremento/incremento.component';
@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [MaterialModule,CommonModule, InputTextModule, ButtonModule, InputTextareaModule, FormsModule, ToastModule,RouterOutlet],
  providers: [DialogService,DynamicDialogRef,MessageService,ConfirmationService],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  persona!: Persona[]
  loading: boolean = true;
  ref: DynamicDialogRef 
  es: any;
  
  constructor(
    private personaService: PersonaService,
    private sucursalService: SucursalService,
    private _dialog :DialogModule,
    public dialogService: DialogService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private tempPlanillaService:TempPlanillaService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig
    ){}

    ngOnInit(): void 
    {  
      this.personaService.findAll().subscribe(data =>
      {
        this.persona = data
      });
      
      this.personaService.getPersonaChange().subscribe(data=>{
        this.updateTable()
      })
  
      this.personaService.getMessageChange().subscribe(data=>
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
      this.personaService.findAll().subscribe(data => {
        this.persona = data
      });
    }
    showDialog(persona?: Persona){
      this.ref = this.dialogService.open(PersonalDialogComponent, {
        header: 'PERSONA',
        data: persona,
        modal:true,
        maximizable:true
      })  
    }
    infoPersona(persona: Persona){
      this.ref = this.dialogService.open(PersonalInfoComponent,{
        header: 'INFORMACION PERSONA',
        data: persona,
        modal: true,
        maximizable:true
      })

    }

    incrementoSlarial(){
      this.ref = this.dialogService.open(IncrementoComponent,{
        header: 'INCREMENTO SALARIAL',
        modal: true,
        maximizable:true
      })

    }

    chekChildren(){
      return this.route.children.length>0;
    }
    
    confirm2(event: Event, idPersona:any) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Quieres Elminar este registro?',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-sm',
          accept: () => {
              this.delete(idPersona)
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No Elminado', life: 3000 });
          }
      });
    }
    delete(idPersona:any){
      this.personaService.delete(idPersona)
      .pipe(switchMap(()=>this.personaService.findAll()))
      .subscribe(data=>{
        this.personaService.setPersonaChange(data);
        this.personaService.setMessageChange('DELETE!');
      })
    }
}
