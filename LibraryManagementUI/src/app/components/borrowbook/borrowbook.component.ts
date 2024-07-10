import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
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
  private destroy$: Subject<void> = new Subject<void>();    // Subject to manage component destruction

  private httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'ni-cache'
    }),
    observe: 'body' as const // Add the observe property with 'body' or 'response' based on your needs
  };

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('BorrowbookComponent initialized');

    this.usnSubscription = this.sessionService.getUSN().pipe(
      catchError(error => {
        console.error('Failed to fetch USN:', error);
        alert('Student not logged in or failed to fetch data.');
        return of(null); // Use 'of' to return an observable
      }),
      switchMap(studentUSN => {
        if (!studentUSN) {
          alert('Student is not logged in.');
          return of([]); // Return an empty array or null to avoid further operations
        }
        return this.fetchBooks();
      }),
      takeUntil(this.destroy$)  // Unsubscribe when component is destroyed
    ).subscribe(
      books => {
        this.book = books;
        this.filteredBooks = [...this.book];
        this.searchBooks();
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    console.log('BorrowbookComponent destroyed');
  }

  private unsubscribe(): void {
    if (this.usnSubscription) {
      this.usnSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchBooks() {
    return this.http.get<any[]>('http://localhost:53110/api/student/books', this.httpOptions).pipe(
      map(response => {
        return response as unknown as any[];   //ensure response is cast to an array of any type
      }),
      catchError(error => {
        console.error('Failed to fetch books:', error);
        alert('Failed to fetch book data.');
        return of([]); // Use 'of' to return an observable
      }),
      takeUntil(this.destroy$)  // Unsubscribe when component is destroyed
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
    this.sessionService.getUSN().pipe(
      catchError(error => {
        console.error('Failed to get student USN:', error);
        alert('Failed to get student USN.');
        return of(null); // Use 'of' to return an observable
      }),
      switchMap(studentUSN => {
        if (!studentUSN) {
          alert('Student is not logged in.');
          return of(null);
        }
        const bookIssue = { ...book, USN: studentUSN };
        console.log('Book issue request:', bookIssue);
        return this.http.post('http://localhost:53110/api/student/BorrowBooks', bookIssue, this.httpOptions).pipe(
          catchError(error => {
            console.error('Failed to borrow book:', error);
            alert('Failed to borrow book.');
            return of(null);
          }),
          takeUntil(this.destroy$)  // Unsubscribe when component is destroyed
        );
      }),
      takeUntil(this.destroy$)  // Unsubscribe when component is destroyed
    ).subscribe(
      result => {
        if (result) {
          this.fetchBooks().subscribe(books => {
            this.book = books;
            this.filteredBooks = [...this.book];
            this.searchBooks();
          });
          alert('Book borrowed successfully.');
        } else {
          console.error('No response body received.');
        }
      },
      error => {
        console.error('Subscription error:', error);
        alert('An error occurred while borrowing the book.');
      }
    );
  }

  logout(): void {
    this.sessionService.clearStudentSession();
    this.router.navigate(['/login']);
  }
}
