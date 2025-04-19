import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRetourComponent } from './button-retour.component';

describe('ButtonRetourComponent', () => {
  let component: ButtonRetourComponent;
  let fixture: ComponentFixture<ButtonRetourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonRetourComponent]
    });
    fixture = TestBed.createComponent(ButtonRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
