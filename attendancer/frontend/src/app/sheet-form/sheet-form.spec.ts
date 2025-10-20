import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetForm } from './sheet-form';

describe('SheetForm', () => {
  let component: SheetForm;
  let fixture: ComponentFixture<SheetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
