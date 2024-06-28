import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-returntracker',
  templateUrl: './returntracker.component.html',
  styleUrls: ['./returntracker.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class ReturntrackerComponent implements OnInit{
  //array to store the data returned by the api controller
  rows: any[] = [];

  constructor(private sessionService: SessionService, private router: Router) {};

  //constructor - page load
  ngOnInit(): void{
    this.returnTrackerData();
  }

  //constructor metho for return tracker data
  private returnTrackerData(): void {
    debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/returnTracker",
      contentType: "application/json;charset=UTF-8",
      dataType: "json",
      success: (resp:any) => {
        this.rows = resp;
        this.returntrackerTable();
      },
      error: (resp:any) => {
        alert('Failed to fetch data');
      }
    });
  }

  //method for return tracker table
  private returntrackerTable(): void{
    //this will trigger angular's chage detection to update the table
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