import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managestudents',
  templateUrl: './managestudents.component.html',
  styleUrls: ['./managestudents.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManagestudentsComponent {
  rows: any[] = [];
  editingRow: any;

  constructor(private sessionService: SessionService, private router: Router) {};

  //constructor
  ngOnInit(): void {
      this.manageStudentsData();
  }

  //constructor method 
  private manageStudentsData(): void{
  debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/studentData",
      contentType: "application?json;charset=UTF-8",
      dataType: "json",
      success: (resp:any) => {
        this.rows = resp;
        this.refreshTable();
      },
      error: (resp:any) => {
        alert('Failed to fetch data');
      }
    });
  }
  
  //table will be updated
  private refreshTable(): void {
    // This will trigger Angular's change detection to update the table
    if(!this.rows){
      this.rows = [];
    }
  }

  editRow_std(row: any): void {
    debugger;
    this.editingRow = { ...row };
  }

  saveRow_std(): void {
    debugger;
    if(this. editingRow) {
      $.ajax({
        type: "PUT",
        url: `http://localhost:53110/api/student/updateStudent/${this.editingRow.usn}`,
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(this.editingRow),
        success: (resp: any) => {
          const index = this.rows.findIndex(row => row.usn === this.editingRow.usn);
          if(index !== -1){
            this.rows[index] = {...this.editingRow };
          }
          this.editingRow = null;
          this.refreshTable();
          alert('Student data updated successfully');
        },
        error: (resp: any) => {
          alert('Failed to update the student');
        }
      });
    }
  }

  cancelEdit(): void {
    debugger;
    this.editingRow = null;
  }

  deleteRow_std(usn: string): void {
    debugger;
    $.ajax({
      type: "DELETE",
      url: `http://localhost:53110/api/student/deleteStudent/${usn}`,
      contentType: "application/json;charset=UTF-8",
      success: (resp: any) => {
        this.rows = this.rows.filter(row => row.usn !== usn);
        this.refreshTable();
        alert('Student data deleted successfully');
      },
      error: (resp: any) => {
        // Display the error message returned from the server
        if (resp.responseJSON) {
          alert('Failed to delete. Student has borrowed the books.');
        } else {
          alert('Failed to delete the student');
        }
      }
    });
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }
}