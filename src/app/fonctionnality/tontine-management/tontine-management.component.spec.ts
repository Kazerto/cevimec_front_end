import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TontineManagementComponent } from './tontine-management.component';

describe('TontineManagementComponent', () => {
  let component: TontineManagementComponent;
  let fixture: ComponentFixture<TontineManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TontineManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TontineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
