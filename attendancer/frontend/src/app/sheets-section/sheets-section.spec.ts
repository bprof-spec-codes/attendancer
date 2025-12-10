import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsSection } from './sheets-section';

describe('SheetsSection', () => {
  let component: SheetsSection;
  let fixture: ComponentFixture<SheetsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
