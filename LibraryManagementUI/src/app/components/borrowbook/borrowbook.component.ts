import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';
import { Subscription, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-borrowbook',
  templateUrl: './borrowbook.component.html',
  styleUrls: ['./borrowbook.component.css']
})
export class BorrowbookComponent implements OnInit, OnDestroy {
  book: any[] = [];
  filteredBooks: any[] = [];
  searchText: string = '';
  private usnSubscription: Subscription | undefined;
  private borrowSubscription: Subscription | undefined;

  constructor(private sessionService: SessionService,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.usnSubscription = this.sessionService.getUSN().pipe(
      catchError(error => {
        console.error('Failed to fetch USN:', error);
        alert('Student not logged in or failed to fetch data.');
        return of(null); // Use 'of' to return an observable
      })
    ).subscribe(
      usn => {
        if (usn) {
          this.fetchBooks();
        } else {
          alert('Student is not logged in.');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.usnSubscription) {
      this.usnSubscription.unsubscribe();
    }
    if (this.borrowSubscription) {
      this.borrowSubscription.unsubscribe();
    }
  }

  private fetchBooks() {
    this.http.get<any[]>('http://localhost:53110/api/student/books').pipe(
      catchError(error => {
        console.error('Failed to fetch books:', error);
        alert('Failed to fetch book data.');
        return of([]); // Use 'of' to return an observable
      })
    ).subscribe(
      books => {
        this.book = books;
        this.filteredBooks = [...this.book];
        this.searchBooks();
      }
    );
  }

  searchBooks(): void {
    if (!this.searchText) {
      this.filteredBooks = [...this.book];
    } else {
      this.filteredBooks = this.book.filter(book =>
        book.book_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.publisher.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.ID_B.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  borrowBook(book: any): void {
    this.borrowSubscription = this.sessionService.getUSN().pipe(
      catchError(error => {
        console.error('Failed to get student USN:', error);
        alert('Failed to get student USN.');
        return of(null); // Use 'of' to return an observable
      }),
      map(studentUSN => ({ ...book, USN: studentUSN })),
      switchMap(bookIssue => {
        if (!bookIssue.USN) {
          alert('Student is not logged in.');
          return of(null); // Use 'of' to return an observable
        }

        return this.http.post('http://localhost:53110/api/student/BorrowBooks', bookIssue).pipe(
          catchError(error => {
            console.error('Failed to borrow book:', error);
            // var er_msg = 'Error: ${error.message}';
            alert('Failed to borrow book.');
            return of(null); // Use 'of' to return an observable
          })
        );
      })
    ).subscribe(
      result => {
        if (result) {
          this.fetchBooks(); // Refresh book list after borrowing
          alert('Book borrowed successfully.');
        }
      }
    );
  }

  logout(): void {
    this.sessionService.clearStudentSession();
    this.router.navigate(['/login']);
  }
}