import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnbookComponent } from './returnbook.component';

describe('ReturnbookComponent', () => {
  let component: ReturnbookComponent;
  let fixture: ComponentFixture<ReturnbookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnbookComponent]
    });
    fixture = TestBed.createComponent(ReturnbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
