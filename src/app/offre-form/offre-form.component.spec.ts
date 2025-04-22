import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreFormComponent } from './offre-form.component';

describe('OffreFormComponent', () => {
  let component: OffreFormComponent;
  let fixture: ComponentFixture<OffreFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffreFormComponent]
    });
    fixture = TestBed.createComponent(OffreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
