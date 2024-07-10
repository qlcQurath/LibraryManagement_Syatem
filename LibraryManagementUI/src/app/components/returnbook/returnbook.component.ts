import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-returnbook',
  templateUrl: './returnbook.component.html',
  styleUrls: ['./returnbook.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class ReturnbookComponent implements OnInit{
  rows: any[] = [];

  //constructor
  constructor(private sessionService: SessionService, private router: Router) {};

  //constructor -  page load
  ngOnInit(): void {
      this.returnBookData();
  }

  //constructor method 
  private returnBookData(): void{
  debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/returnBook",
      contentType: "application/json;charset=UTF-8",
      dataType: "json",
      success: (resp:any) => {
        this.rows = resp;
        this.returnbookTable();
      },
      error: (resp:any) => {
        alert('Failed to fetch data');
      }
    });
  }
  
  //table will be updated
  private returnbookTable(): void {
    // This will trigger Angular's change detection to update the table
    if(!this.rows){
      this.rows = [];
    }
  }

  returnBook(row: any): void{
    debugger;
    console.log('Returning book with ID:', row.ID_B);
    $.ajax({
      type: "PUT",
      url: `http://localhost:53110/api/student/returnBook/${row.ID_B}`,
      contentType: "application/json;charset=UTF-8",
      success: (resp: any) => {
        console.log('Return date updated successfully', resp);
        alert('Book returned successfully');
        //update return date in the table
        row.return_date = new Date().toISOString().split('T')[0];

        //Remove the returned book from the ui
        this.rows = this.rows.filter(book => book.ID_B !== row.ID_B); 
      },
      error: (resp: any) => {
        console.error('Failed to update return date', resp);
        alert('Failed to update retutn date');
      }
    });
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }
}