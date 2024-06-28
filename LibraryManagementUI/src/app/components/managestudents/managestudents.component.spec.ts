import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagestudentsComponent } from './managestudents.component';

describe('ManagestudentsComponent', () => {
  let component: ManagestudentsComponent;
  let fixture: ComponentFixture<ManagestudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagestudentsComponent]
    });
    fixture = TestBed.createComponent(ManagestudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
