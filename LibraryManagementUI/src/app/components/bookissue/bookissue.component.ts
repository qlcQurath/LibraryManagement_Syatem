import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-bookissue',
  templateUrl: './bookissue.component.html',
  styleUrls: ['./bookissue.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class BookissueComponent {
  rows: any[] = [];

  constructor(private sessionService: SessionService, private router: Router) {};

  //constructor
  ngOnInit(): void {
      this.book_issueData();
  }

  //constructor method 
  private book_issueData(): void{
  debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/book_issue",
      contentType: "application?json;charset=UTF-8",
      dataType: "json",
      success: (resp:any) => {
        this.rows = resp;
        this.book_issue_update();
      },
      error: (resp:any) => {
        alert('Failed to fetch data');
      }
    });
  }
  
  //table will be updated
  private book_issue_update(): void {
    // This will trigger Angular's change detection to update the table
    if(!this.rows){
      this.rows = [];
    }
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }

}