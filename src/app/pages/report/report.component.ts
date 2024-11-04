import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SucursalService } from '../../services/sucursal.service';
import { PlanillaService } from '../../services/planilla.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterLink],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  
  constructor(private sucursalService: SucursalService,
    private planillaService: PlanillaService     
  ){

  }
  ngOnInit(): void {
    
  }

  viewReport(type:string){
    this.sucursalService.generateReport().subscribe(data=>{
      console.log(data);
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
    this.planillaService.generateReportPDF().subscribe(data=>{
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
  generateReportBoleta(type:string){
    this.planillaService.boletaReportTxt(10).subscribe(data=>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.txt';
      a.click()
    })
  }

}
