import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCarouselComponent } from './background-carousel.component';

describe('BackgroundCarouselComponent', () => {
  let component: BackgroundCarouselComponent;
  let fixture: ComponentFixture<BackgroundCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundCarouselComponent]
    });
    fixture = TestBed.createComponent(BackgroundCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
