import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsManagementComponent } from './savings-management.component';

describe('SavingsManagementComponent', () => {
  let component: SavingsManagementComponent;
  let fixture: ComponentFixture<SavingsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
