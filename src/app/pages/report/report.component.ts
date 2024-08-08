import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterLink],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  
  constructor(private sucursalService: SucursalService){

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

}
