import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
// declare var $:any;
import * as $ from 'jquery';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.Emulated // or Native or None
})
export class AdminComponent implements OnInit, AfterViewInit{
  studentCount: number = 0; 
  bookCount: number = 0;
  pendingReturnCount: number = 0;
  borrowedBooksData: { Labels: string[], Values: number[] } = { Labels: [], Values: []};


  constructor(private sessionService: SessionService, private router: Router) { }

  //constructor
  ngOnInit(): void {
    this.loadDashboardData();

    //test jquery
    $(document).ready(function () {
      console.log('jQuery is working');
    });
  }

  ngAfterViewInit(): void {
    // call updateUI in ngAfterViewInit to ensure DOM elements are ready
    this.updateUI;
  }

  //ajax
  private loadDashboardData(): void {
    debugger;
    $.ajax({
      type: "GET",
      url: "http://localhost:53110/api/student/DashboardData",
      contentType: "application/json;charset=UTF-8",
      dataType: "json",
      success: (response: any) => {
        console.log(response);
        //api returns the JSON object with keys: studentCount, bookCount, pendingReturnCount
        this.studentCount = response.studentCount;
        this.bookCount = response.bookCount;
        this.pendingReturnCount = response.pendingReturnCount;
        this.borrowedBooksData = {
          Labels: response.borrowedBooksData.Labels,
          Values: response.borrowedBooksData.Values
        };
        console.log(this.borrowedBooksData);

        this.updateUI(); //call the method to update the UI afterdata is fetched
      },
      error: (xhr, status, error) => {
        console.error('Failed to fetch data:', error);
        $('#error-message').text('Failed to fetch dashboard data. Please try again later.');
      }
    });
  }

  private updateUI(): void{
    //update UI elements with fetched data
    $('#studentCount').text(this.studentCount);
    $('#bookCount').text(this.bookCount);
    $('#pendingReturnCount').text(this.pendingReturnCount);
    debugger;
    setTimeout(() => {
      var ctx = document.getElementById('borrowedBooksChart') as HTMLCanvasElement;
      console.log(ctx); // Add this line to check if ctx is defined
      if (ctx) {
        Chart.register(...registerables); // Register all necessary component with Chart.js
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.borrowedBooksData.Labels,
            datasets: [{
              label: 'Books Borrowed Daily',
              data: this.borrowedBooksData.Values,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        console.error('Canvas element not found');
      }
    }, 1000); // Adjust the delay if necessary
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }
}