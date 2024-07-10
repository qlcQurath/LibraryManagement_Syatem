import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UuidService } from 'src/app/services/uuid.service';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AddbookComponent implements OnInit{
  uuid!: string;
  bookName!: string;
  authorName!: string;
  publisher!: string;
  numberOfBooks!: number;
  costPerBook!: number;
  totalCost: number = 0;

  //event listener for preventing default behaviour
  private wheelEventListener!: (e: Event) => void;

  constructor(private uuidService: UuidService, private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.uuid = this.uuidService.getUuid();
    this.wheelEventListener = function (e: Event) {
      e.preventDefault();
    };
    document.addEventListener('wheel', this.wheelEventListener, { passive: false });
  }

  ngOnDestroy(): void {
    document.removeEventListener('wheel', this.wheelEventListener);
  }

  // // Method to check if form fields are filled
  isFormValid(): boolean {
    const formelements = document.querySelector('form');
    return formelements?.checkValidity() ?? false;
  }

  OnSubmit(): void {
    debugger;
    //check the form fields are filled or not
    if (!this.isFormValid()) {
      alert('Please fill in all form fields before submitting.');
      return;
    }
    const formData = {
      uuid: this.uuid,
      ID_B: ($('#ID_B') as any).val(),
      book_name: ($('#book_name') as any).val(),
      author: ($('#author') as any).val(),
      publisher: ($('#publisher') as any).val(),
      book_count: ($('#book_count') as any).val(),
      cost_per_book: ($('#cost_per_book') as any).val(),
      total_cost: ($('#total_cost') as any).val()
    };

    //ajax
    $.ajax({
      type: "POST",
      url: "http://localhost:53110/api/student/books",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(formData),
      success: (response) => {
        this.clearForm();
        this.uuidService.clearUuid();
        this.uuid = this.uuidService.getUuid();     //Refresh UUID
        alert(`Form submitted successfully! ${response.message}`);
      },
      error: (xhr, status, error) => {
        //handle error response
        alert(`Failed to submit form: ${xhr.responseJSON || xhr.statusText}`);
      }
    });
  }

  //calcultate the total cost 
  calculateTotalCost(): void {
    const cost = this.costPerBook || 0;
    const count = this.numberOfBooks || 0;
    this.totalCost = cost * count;
  }

  //method to claer the form details
  clearForm() {
    // Clear the value of each input field if they exist
    const clearField = (id: string) => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        element.value = '';
      }
    }

    //call the clearField function for each fiels
    clearField('ID_B');
    clearField('book_name');
    clearField('author');
    clearField('publisher');
    clearField('book_count');
    clearField('cost_per_book');
    clearField('total_cost');
  }

  logout(): void {
    debugger;
    this.sessionService.clearAdminSession();
    this.router.navigate(['/login']);
  }
}