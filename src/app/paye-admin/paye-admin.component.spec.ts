import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeAdminComponent } from './paye-admin.component';

describe('PayeAdminComponent', () => {
  let component: PayeAdminComponent;
  let fixture: ComponentFixture<PayeAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayeAdminComponent]
    });
    fixture = TestBed.createComponent(PayeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
