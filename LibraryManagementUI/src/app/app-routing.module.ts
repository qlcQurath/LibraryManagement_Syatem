import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { StudentboardComponent } from './components/studentboard/studentboard.component';
import { AddbookComponent } from './components/addbook/addbook.component';
import { BookissueComponent } from './components/bookissue/bookissue.component';
import { BorrowbookComponent } from './components/borrowbook/borrowbook.component';
import { ManagebookComponent } from './components/managebook/managebook.component';
import { ManagestudentsComponent } from './components/managestudents/managestudents.component';
import { MyborrowsComponent } from './components/myborrows/myborrows.component';
import { ReportComponent  } from './components/report/report.component';
import { ReturntrackerComponent } from './components/returntracker/returntracker.component';
import { ReturnbookComponent } from './components/returnbook/returnbook.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { StdAuthGuard } from './guards/std-auth.guard';


const routes: Routes = [
  //initialize the page
  { path: 'index', component: HomepageComponent},
  { path: '', component: HomepageComponent },

  //add components path
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},

  //admin dashboard components
  { path: 'admin', component: AdminComponent, canActivate: [adminAuthGuard]},
  { path: 'managestudents', component: ManagestudentsComponent, canActivate: [adminAuthGuard]},
  { path: 'managebook', component: ManagebookComponent, canActivate: [adminAuthGuard]},
  { path: 'addbook', component: AddbookComponent, canActivate: [adminAuthGuard]},
  { path: 'bookissue', component: BookissueComponent, canActivate: [adminAuthGuard]},
  { path: 'returnbook', component: ReturnbookComponent, canActivate: [adminAuthGuard]},
  { path: 'returntracker', component: ReturntrackerComponent, canActivate: [adminAuthGuard]},
  { path: 'report', component: ReportComponent, canActivate: [adminAuthGuard]},

  //student dashboard components
  { path: 'studentboard', component: StudentboardComponent, canActivate: [StdAuthGuard]},
  { path: 'borrowbook', component: BorrowbookComponent, canActivate: [StdAuthGuard]},
  { path: 'myborrows', component: MyborrowsComponent, canActivate: [StdAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
