import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-studentboard',
  templateUrl: './studentboard.component.html',
  styleUrls: ['./studentboard.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class StudentboardComponent implements OnInit, OnDestroy {
  TotalBooks: number = 0;
  BorrowedBooksCount: number = 0;
  BooksToBeReturnedCount: number = 0;
  private usnSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch student dashboard data
    this.fetchStudentDashboard();
  }

  ngOnDestroy(): void {
    if (this.usnSubscription) {
      this.usnSubscription.unsubscribe();
    }
  }


  fetchStudentDashboard(): void {
    this.usnSubscription = this.sessionService.getUSN().subscribe(
      usn => {
        if (usn) {
          const apiUrl = `http://localhost:53110/api/student/studentboard/${usn}`;
          this.http.get<any>(apiUrl).subscribe(
            (data: any) => {
              this.TotalBooks = data.TotalBooks;
              this.BorrowedBooksCount = data.BorrowedBooksCount;
              this.BooksToBeReturnedCount = data.BooksToBeReturnedCount;
            },
            error => {
              console.error('Failed to fetch student dashboard data:', error);
              // Handle error as needed
            }
          );
        } else {
          console.error('Student USN not found in session.');
          // Handle error as needed
        }
      }
    );
  }

  logout(): void {
    this.sessionService.clearStudentSession();
    this.router.navigate(['/login']);
  }
}