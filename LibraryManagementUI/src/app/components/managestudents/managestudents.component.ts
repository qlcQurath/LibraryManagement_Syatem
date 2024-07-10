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

  constructor(private sessionService: SessionService, private router: Router) { };

  //constructor
  ngOnInit(): void {
    this.manageStudentsData();
  }

  //constructor method - assign temporary IDs to rowss to handle editing
  private manageStudentsData(): void {
    debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/studentData",
      contentType: "application?json;charset=UTF-8",
      dataType: "json",
      success: (resp: any) => {
        this.rows = resp.map((row: any, index: number) => ({
          ...row,
          tempId: index     //assign a temporary ID
        }));
        this.refreshTable();
      },
      error: (resp: any) => {
        alert('Failed to fetch data');
      }
    });
  }

  //table will be updated
  private refreshTable(): void {
    // This will trigger Angular's change detection to update the table
    if (!this.rows) {
      this.rows = [];
    }
  }

  editRow_std(row: any): void {
    debugger;
    this.editingRow = { ...row };
  }

  saveRow_std(): void {
    debugger;
    if (this.editingRow) {
      if (this.validateRow(this.editingRow)) {
        $.ajax({
          type: "PUT",
          url: `http://localhost:53110/api/student/updateStudent/${this.editingRow.usn}`,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(this.editingRow),
          success: (resp: any) => {
            const index = this.rows.findIndex(row => row.tempId === this.editingRow.tempId);
            if (index !== -1) {
              this.rows[index] = { ...this.editingRow };
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
      else{
        alert('Please fill all fields with correct credentials');
      }
    }
  }

  //validate the field and check every filed id filled
  validateRow(row: any): boolean {
    // Regex patterns
    const regex_firstname = /^[a-zA-Z]+$/;
    const regex_lastname = /^[a-zA-Z]+$/;
    const regex_age = /^[0-9]{1,2}$/;
    const regex_gender = /^Male|Female|Other$/;
    const regex_usn = /^[0-9][a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3}$/; // Example: 4MO18CS028
    const regex_course = /^B\.E|BCA|Other$/;
    const regex_branch = /^CSE|ISE|ECE|ME|CV|Other$/;
    const regex_email = /^[A-Za-z0-9]+[\#\$\%\&\'\*\+\-\/\=\?\^\`\_\{\}\~\;A-Za-z0-9]+[\@].[A-za-z]+[\.].[A-Za-z]{1,2}$/;
    const regex_phoneno = /^[6-9][0-9]{9}$/;

    // Validation checks
    if (!regex_firstname.test(row.firstname)) {
        alert("Please enter a valid First Name");
        return false;
    }

    else if (!regex_lastname.test(row.lastname)) {
        alert("Please enter a valid Last Name");
        return false;
    }

    else if (!regex_age.test(row.age) || row.age == 0) {
        alert("Please enter a valid Age");
        return false;
    }

    else if (!regex_gender.test(row.gender)) {
        alert("Please select a valid Gender");
        return false;
    }

    else if (!regex_usn.test(row.usn)) {
        alert("Please enter a valid USN");
        return false;
    }

    else if (!regex_course.test(row.course)) {
        alert("Please select a valid Course");
        return false;
    }

    else if (!regex_branch.test(row.branch)) {
        alert("Please select a valid Branch/Section");
        return false;
    }

    else if (!regex_email.test(row.email)) {
        alert("Please enter a valid Email");
        return false;
    }

    else if (!regex_phoneno.test(row.phoneno)) {
        alert("Please enter a valid Phone Number");
        return false;
    }

    return true;
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