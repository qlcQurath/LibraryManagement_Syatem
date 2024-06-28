import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyborrowsComponent } from './myborrows.component';

describe('MyborrowsComponent', () => {
  let component: MyborrowsComponent;
  let fixture: ComponentFixture<MyborrowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyborrowsComponent]
    });
    fixture = TestBed.createComponent(MyborrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
