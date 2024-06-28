import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//login component requirement
import { HttpClientModule } from '@angular/common/http';

//form modules for add book component
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { ReportComponent } from './components/report/report.component';
import { ReturnbookComponent } from './components/returnbook/returnbook.component';
import { ReturntrackerComponent } from './components/returntracker/returntracker.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    StudentboardComponent,
    AddbookComponent,
    BookissueComponent,
    BorrowbookComponent,
    ManagebookComponent,
    ManagestudentsComponent,
    MyborrowsComponent,
    ReportComponent,
    ReturnbookComponent,
    ReturntrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
