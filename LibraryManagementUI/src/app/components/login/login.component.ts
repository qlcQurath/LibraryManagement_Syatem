import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
// declare var $: any;
import { HttpClient } from '@angular/common/http';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent {

  constructor(private sessionService: SessionService, private router: Router, private http: HttpClient) { }

  // //constructor - page load
  // ngOnInit(): void{}


  //login click function
  logindata(): void {
    debugger;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const logindata = {email: email, password: password};

    if (email == '' || password == '') {
      alert("Please enter Credentials.");
      return;
    }

    //regex
    const regex_email = /^[A-Za-z0-9]+[\#\$\%\&\'\*\+\-\/\=\?\^\`\_\{\}\~\;A-Za-z0-9]+[\@].[A-za-z]+[\.].[A-Za-z]{1,2}$/;
    const regex_pswd = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]{1,2})(?=.*\d{1,4}).{8,16}$/;


    //validation
    if (!regex_email.test(email)) {
      alert("Please enter valid email");
      return;
    }

    if (!regex_pswd.test(password)) {
      alert("Please enter valid password");
      return;
    }

    //check the email 
    const apiUrl = email === "admin@gmail.com"
      ? `http://localhost:53110/api/student/loginAdmin`
      : `http://localhost:53110/api/student/login`;

    this.http.post<any>(apiUrl, logindata, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      resp => {
        debugger;
        if (email === "admin@gmail.com") {
          this.sessionService.setAdminEmail(email);
          alert('Admin Login Successful');
          this.router.navigate(['/admin']);
        } else {
          if (resp && resp.USN) {
            this.sessionService.setUSN(resp.USN);
            alert('Student Login Successful');
            this.router.navigate(['/studentboard']);
          } else {
            alert(resp);
          }
        }
      },
      error => {
        console.error('Login Error:', error);
        alert('Login Failed');
      }
    );
  }
}