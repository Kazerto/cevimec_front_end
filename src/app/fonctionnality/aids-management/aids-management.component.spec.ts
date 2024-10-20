import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidsManagementComponent } from './aids-management.component';

describe('AidsManagementComponent', () => {
  let component: AidsManagementComponent;
  let fixture: ComponentFixture<AidsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AidsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AidsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
