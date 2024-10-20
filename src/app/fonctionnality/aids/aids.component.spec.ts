import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidsComponent } from './aids.component';

describe('AidsComponent', () => {
  let component: AidsComponent;
  let fixture: ComponentFixture<AidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
