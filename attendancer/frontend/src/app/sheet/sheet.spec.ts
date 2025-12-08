import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sheet } from './sheet';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('Sheet', () => {
  let component: Sheet;
  let fixture: ComponentFixture<Sheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sheet],
      imports: [HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: { params: of({ id: "abcf9f45-d59d-4229-b13a-28e9a35718ca"}) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should correctly count present and absent participants', () => {
    // Vannak értékek.
    component.event.participants = [
      { present: true },
      { present: false },
      { present: true },
      { present: false },
    ];

    component.countPresent();

    expect(component.presentCount).toBe(2);
    expect(component.absentCount).toBe(2);
  });

  it('should handle an empty participants array', () => {
    // Nincsenek értékek.
    component.event.participants = [];

    component.countPresent();

    expect(component.presentCount).toBe(0);
    expect(component.absentCount).toBe(0);
  });
});
