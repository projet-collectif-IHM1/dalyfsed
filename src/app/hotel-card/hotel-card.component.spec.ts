import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCardComponent } from './hotel-card.component';

describe('HotelCardComponent', () => {
  let component: HotelCardComponent;
  let fixture: ComponentFixture<HotelCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelCardComponent]
    });
    fixture = TestBed.createComponent(HotelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
