import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryGeneralComponent } from './secretary-general.component';

describe('SecretaryGeneralComponent', () => {
  let component: SecretaryGeneralComponent;
  let fixture: ComponentFixture<SecretaryGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecretaryGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretaryGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
