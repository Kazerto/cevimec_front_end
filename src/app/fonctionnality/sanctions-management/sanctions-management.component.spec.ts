import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsManagementComponent } from './sanctions-management.component';

describe('SanctionsManagementComponent', () => {
  let component: SanctionsManagementComponent;
  let fixture: ComponentFixture<SanctionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanctionsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
