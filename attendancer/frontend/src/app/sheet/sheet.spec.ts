import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sheet } from './sheet';

describe('Sheet', () => {
  let component: Sheet;
  let fixture: ComponentFixture<Sheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
