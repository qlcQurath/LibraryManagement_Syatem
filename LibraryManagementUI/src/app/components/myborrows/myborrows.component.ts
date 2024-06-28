import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-myborrows',
  templateUrl: './myborrows.component.html',
  styleUrls: ['./myborrows.component.css']
})
export class MyborrowsComponent implements OnInit, OnDestroy {
  borrowedBooks: any[] = [];
  private usnSubscription: Subscription | undefined;

  constructor(private sessionService: SessionService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.usnSubscription = this.sessionService.getUSN().subscribe(usn => {
      if (usn) {
        this.fetchBorrowedBooks(usn);
      } else {
        alert('Student not logged in');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.usnSubscription) {
      this.usnSubscription.unsubscribe();
    }
  }

  private fetchBorrowedBooks(usn: string): void {
    const apiUrl = `http://localhost:53110/api/student/borrowedBooks/${usn}`;
    this.http.get<any[]>(apiUrl).subscribe(
      books => {
        this.borrowedBooks = books;
      },
      error => {
        alert('Failed to fetch borrowed books.');
      }
    );
  }

  logout(): void {
    this.sessionService.clearStudentSession();
    this.router.navigate(['/login']);
  }
}