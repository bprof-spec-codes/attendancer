import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWarning } from './modal-warning';

describe('ModalWarning', () => {
  let component: ModalWarning;
  let fixture: ComponentFixture<ModalWarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalWarning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWarning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
