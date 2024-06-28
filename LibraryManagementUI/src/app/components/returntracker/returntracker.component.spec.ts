import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturntrackerComponent } from './returntracker.component';

describe('ReturntrackerComponent', () => {
  let component: ReturntrackerComponent;
  let fixture: ComponentFixture<ReturntrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturntrackerComponent]
    });
    fixture = TestBed.createComponent(ReturntrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
