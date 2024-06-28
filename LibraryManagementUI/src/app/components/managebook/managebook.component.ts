import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SessionService } from 'src/app/services/session.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-managebook',
  templateUrl: './managebook.component.html',
  styleUrls: ['./managebook.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class ManagebookComponent implements OnInit{
  rows: any[] = [];     //array to store data fetched from the api 
  editingRow: any = null;      // Object to hold the currently editing row
  editingRowIndex: number = -1;   //Index of the row being edited

  constructor(private sessionService: SessionService, private router: Router) {};

  //constructor
  ngOnInit(): void{
    this.manageBooksData();
  }

  //class for manage books -to fetch books data
  private manageBooksData(): void {
    debugger;
      $.ajax({
        type: "GET",
        url: "http://localhost:53110/api/student/booksData",
        contentType: "application?json;charset=UTF-8",
        dataType: "json",
        success: (resp: any) => {
          this.rows = resp;
          this.booksTable();
        },
        error: (resp: any) => {
          alert('Failed to fetch data.');
        }
      });
  }

  //update the table
  private booksTable(): void{
    //This will trigger the angular's change detection to update the table
    if(!this.rows){
      this.rows = [];
    }
  }

  editRow_book(index: number): void {
    // debugger;
    this.editingRow = { ...this.rows[index] };    // Copy row to editingRow
    this.editingRowIndex = index;                 // Track the index of editing row
  }

  saveRow_book(): void {
    debugger;
    if(this. editingRow) {
      $.ajax({
        type: "PUT",
        url: `http://localhost:53110/api/student/updateBook/${this.editingRow.ID_B}`,
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(this.editingRow),
        success: (resp: any) => {
          //update the row in the local data
          const index = this.editingRowIndex;
          this.rows[index] = {...this.editingRow };
          //reset editing state
          this.editingRow = null;
          this.editingRowIndex = -1;
          this.booksTable();
          alert('Book data updated successfully');
        },
        error: (resp: any) => {
          alert('Failed to update the student');
        }
      });
    }
  }

  cancelEdit(): void {
    // debugger;
    this.editingRow = null;
    this.editingRowIndex = -1;
  }

  deleteRow_book(ID_B: string): void {
    debugger;
    $.ajax({
      type: "DELETE",
      url: `http://localhost:53110/api/student/deleteBook/${ID_B}`,
      contentType: "application/json;charset=UTF-8",
      success: (resp: any) => {
        //Remove the row from the local data
        this.rows = this.rows.filter(row => row.ID_B !== ID_B);
        this.booksTable();
        alert('Book data deleted successfully');
      },
      error: (resp: any) => {
        if(resp){
          alert('Failed to delete. Book has issued.');
        }
        else{
          alert('Failed to delete the Book');
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