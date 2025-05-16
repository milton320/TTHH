import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SucursalService } from '../../services/sucursal.service';
import { PlanillaService } from '../../services/planilla.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Persona } from '../../model/persona';
import { PersonaService } from '../../services/persona.service';
import { Planilla } from '../../model/planilla';
import { FormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { AnticipoService } from '../../services/anticipo.service';
import { LoginService } from '../../services/login.service';
import { InfoPersona } from '../../model/infoPersona';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  persona:Persona[];
  filtrarPersonas: any[] | undefined;
  planilla:Planilla
  planilla1:Planilla[]
  infoPersona!:InfoPersona
  username: string
  role: string
  idPersona: number
  anticipoPorPersona:any;
  
  constructor(private sucursalService: SucursalService,
    private planillaService: PlanillaService,
    private personaService: PersonaService,   
    private anticipoService: AnticipoService,  
    private loginService: LoginService
  ){

  }
  ngOnInit(): void {

    
    this.personaService.findAll().subscribe(data =>{this.persona = data});
    this.planillaService.findAll().subscribe(data =>{this.planilla1 = data});

    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.role = decodedToken.role;
    this.idPersona = decodedToken.idPersona;


    this.anticipoService.anticiposPorPersona(this.username).subscribe(data=>{
      this.anticipoPorPersona = data
    })

    this.loginService.userInformacion(this.username).subscribe(data=>{
      this.infoPersona = data[0];
      
    })
    
  }

  viewReport(type:string){
    this.sucursalService.generateReport().subscribe(data=>{
      
    })
  }

  downloadReport(type:string){
    this.sucursalService.generateReport().subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.pdf';
      a.click()
    })
  }
  
  planillatXls(type:string){
    this.planillaService.generateReportXL().subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.xls';
      a.click()
    })
  }

  
  planillatPdf(type:string){
    this.planillaService.generateReportPDF(this.username).subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'planilla.pdf';
      a.click()
    })
  }
  aguinaldoReportpdf(type:string){
    this.planillaService.aguinaldoReportpdf().subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.pdf';
      a.click()
    })
  }
  generateReportTxt(type:string){
    this.planillaService.generateReportTxt().subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.txt';
      a.click()
    })
  } 
  /*BOLETA DE PAOGO*/
/*   generateReportBoleta(type: string,planilla:any) {
    const idPersona = planilla.idPersona;
    console.log(idPersona);
    this.planillaService.boletaReportTxt(idPersona).subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      if (type === 'ver') {
        window.open(url, '_blank');
      } else if (type === 'descargar') {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Boleta_10.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }, error => {
      console.error('Error al generar la boleta', error);
    });
  } */
    generateReportBoleta(type: string, planilla: any) {
    
    
      if (!planilla || !planilla.idPersona) {
        console.error('No se ha seleccionado una persona válida');
        return;
      }
    
      const idPersona = planilla.idPersona;
    
      this.planillaService.boletaReportTxt(idPersona,this.username).subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
    
        if (type === 'ver') {
          window.open(url, '_blank');
        } else if (type === 'descargar') {
          const a = document.createElement('a');
          a.href = url;
          a.download = `Boleta_${idPersona}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }, error => {
        console.error('Error al generar la boleta', error);
      });
    }

    generatePersonalBoleta(type: string, idPersona: number) {

      this.planillaService.boletaReportTxt(idPersona,this.username).subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
    
        if (type === 'ver') {
          window.open(url, '_blank');
        } else if (type === 'descargar') {
          const a = document.createElement('a');
          a.href = url;
          a.download = `Boleta_${idPersona}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }, error => {
        console.error('Error al generar la boleta', error);
      });
    }
   /*  generateReportBoleta(idPersona: number) {
      this.planillaService.boletaPagoPDF(idPersona).subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Boleta_${idPersona}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } */
    

  /**planilla PDF EVENTUAL */

  planillatPdfEventual(type:string ){
    this.planillaService.generateReportPDFEventual(this.username).subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'planilla.pdf';
      a.click()
    })
  }

  /** FILTRAR POR NOMBRES */
  filterPersonas(event: AutoCompleteCompleteEvent){

    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.persona as any[]).length; i++) {
      let personas = (this.persona as any[])[i];
      if (personas.ci.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(personas);
        
      }
    }
    this.filtrarPersonas = filtered;
    
    
  }

}
