import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentboardComponent } from './studentboard.component';

describe('StudentboardComponent', () => {
  let component: StudentboardComponent;
  let fixture: ComponentFixture<StudentboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentboardComponent]
    });
    fixture = TestBed.createComponent(StudentboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
