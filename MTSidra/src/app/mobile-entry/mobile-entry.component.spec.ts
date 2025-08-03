import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileEntryComponent } from './mobile-entry.component';

describe('MobileEntryComponent', () => {
  let component: MobileEntryComponent;
  let fixture: ComponentFixture<MobileEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
