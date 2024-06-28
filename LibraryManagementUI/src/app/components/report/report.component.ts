import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
//dependencies for pdf download
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ReportComponent implements OnInit {
  //array to store api sent data
  rows: any[] = [];

  //constructor
  constructor(private sessionService: SessionService, private router: Router) { };

  //page load constructor
  ngOnInit(): void {
    this.reportData();
  }

  private reportData(): void {
    debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/report",
      contentType: "application/json;charset=UTF-8",
      dataType: "json",
      success: (resp: any) => {
        this.rows = resp;
        this.reportTable();
      },
      error: (resp: any) => {
        alert('Failed to tech the data');
      }
    });
  }

  //methos for report table
  private reportTable(): void {
    //this will trigger angular's chnage detection to update table
    if (!this.rows) {
      this.rows = [];
    }
  }

  downloadAsPDF(): void {
    // const doc = new jsPDF();
    const element = document.querySelector('.table-responsive') as HTMLElement;
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;     //mm (A4 width)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;    //scale height based on imgWidth 
        const doc = new jsPDF();
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('Report.pdf');
      });
    }
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }
}