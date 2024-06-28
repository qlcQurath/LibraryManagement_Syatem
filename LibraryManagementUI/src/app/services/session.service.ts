import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private usnSubject = new BehaviorSubject<string | null>(null);
  //admin sesion management
  private adminEmailSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    const storedUSN = sessionStorage.getItem('usn');
    this.usnSubject = new BehaviorSubject<string | null>(storedUSN);
  }

  //student session management start
  setUSN(usn: string): void {
    localStorage.setItem('studentUSN', usn);
    this.usnSubject.next(usn);
  }

  getUSN(): Observable<string | null> {
    const storedUSN = localStorage.getItem('studentUSN');
    if(storedUSN) {
      this.usnSubject.next(storedUSN);
    }
    return this.usnSubject.asObservable();
  }

  //student session management end


  //Admin session management start
  setAdminEmail(email: string): void {
    localStorage.setItem('adminEmail', email);
    this.adminEmailSubject.next(email);
  }

  getAdminEmail(): Observable<string | null> {
    const storedEmail = localStorage.getItem('adminEmail');
    if(storedEmail) {
      this.adminEmailSubject.next(storedEmail);
    }
    return this.adminEmailSubject.asObservable();
  }
  //Admin session management end
  

  //clear student and admin sessions
  clearStudentSession(): void {
    localStorage.removeItem('studentUSN');
    this.usnSubject.next(null);
  }

  clearAdminSession(): void {
    localStorage.removeItem('adminEmail');
    this.adminEmailSubject.next(null);
  }

  clearAllSessions(): void {
    this.clearStudentSession();
    this.clearAdminSession();
  }

}