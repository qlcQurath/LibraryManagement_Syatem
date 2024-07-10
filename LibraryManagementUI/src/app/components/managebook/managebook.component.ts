import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

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
    if(this. editingRow && this.validateRow(this.editingRow)) {
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

  //validate the credentials
  private validateRow(row: any): boolean {
    debugger;
    if(!row.book_name || !row.author || !row.publisher || !row.book_count || !row.cost_per_book) {
      alert('Please fill in all fields.');
      return false;
    }

    //check if the book name or ID_B is repeated
    const duplicates = this.rows.filter(r => r.ID_B !== row.ID_B && r.book_name.toLowerCase() === row.book_name.toLowerCase());
    if(duplicates.length > 0 ){
      alert('Book Name or ID_B already exists.');
      return false;
    }

    //calculate total cost if book count or cost per book is edited
    if(this.rows[this.editingRowIndex].book_count !== row.book_count || this.rows[this.editingRowIndex].cost_per_book !== row.cost_per_book) {
      row.total_cost = row.book_count * row.cost_per_book;
    }

    return true;
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