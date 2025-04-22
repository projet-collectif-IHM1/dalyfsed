import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisAdminComponent } from './avis-admin.component';

describe('AvisAdminComponent', () => {
  let component: AvisAdminComponent;
  let fixture: ComponentFixture<AvisAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisAdminComponent]
    });
    fixture = TestBed.createComponent(AvisAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
