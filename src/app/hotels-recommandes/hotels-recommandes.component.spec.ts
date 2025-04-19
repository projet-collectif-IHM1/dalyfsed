import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsRecommandesComponent } from './hotels-recommandes.component';

describe('HotelsRecommandesComponent', () => {
  let component: HotelsRecommandesComponent;
  let fixture: ComponentFixture<HotelsRecommandesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelsRecommandesComponent]
    });
    fixture = TestBed.createComponent(HotelsRecommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
