import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSidraComponent } from './ticket-sidra.component';

describe('TicketSidraComponent', () => {
  let component: TicketSidraComponent;
  let fixture: ComponentFixture<TicketSidraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketSidraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSidraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
