import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router) { }

  confirmLogout(): void{
    const confirmation = confirm('Are you sure want to logout?');
    if(confirmation) {
      this.router.navigate(['/logout']);
    }
  }
}