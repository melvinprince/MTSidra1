import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptValComponent } from './appt-val.component';

describe('ApptValComponent', () => {
  let component: ApptValComponent;
  let fixture: ComponentFixture<ApptValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
