import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSection } from './statistics-section';

describe('StatisticsSection', () => {
  let component: StatisticsSection;
  let fixture: ComponentFixture<StatisticsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
