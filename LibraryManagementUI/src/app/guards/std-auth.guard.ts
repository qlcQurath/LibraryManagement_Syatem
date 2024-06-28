import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StdAuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.sessionService.getUSN().pipe(
      map(usn => {
        if (usn) {
          return true;
        } else {
          alert('Student is not logged in');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}