import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsoulBgComponent } from './carsoul-bg.component';

describe('CarsoulBgComponent', () => {
  let component: CarsoulBgComponent;
  let fixture: ComponentFixture<CarsoulBgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarsoulBgComponent]
    });
    fixture = TestBed.createComponent(CarsoulBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
