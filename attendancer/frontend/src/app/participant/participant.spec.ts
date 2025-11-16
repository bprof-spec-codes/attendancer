import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Participant } from './participant';

describe('Participant', () => {
  let component: Participant;
  let fixture: ComponentFixture<Participant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Participant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Participant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
