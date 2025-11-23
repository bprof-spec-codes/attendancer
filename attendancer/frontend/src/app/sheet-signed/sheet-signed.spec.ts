import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetSigned } from './sheet-signed';

describe('SheetSigned', () => {
  let component: SheetSigned;
  let fixture: ComponentFixture<SheetSigned>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetSigned]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetSigned);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
