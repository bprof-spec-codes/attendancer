import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registration } from './registration';

describe('Registration', () => {
  let component: Registration;
  let fixture: ComponentFixture<Registration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Registration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
