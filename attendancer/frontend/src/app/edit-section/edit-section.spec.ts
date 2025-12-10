import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSection } from './edit-section';

describe('EditSection', () => {
  let component: EditSection;
  let fixture: ComponentFixture<EditSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
