import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallTontineManagementComponent } from './small-tontine-management.component';

describe('SmallTontineManagementComponent', () => {
  let component: SmallTontineManagementComponent;
  let fixture: ComponentFixture<SmallTontineManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallTontineManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallTontineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
