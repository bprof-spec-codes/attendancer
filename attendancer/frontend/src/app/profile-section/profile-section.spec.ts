import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSection } from './profile-section';

describe('ProfileSection', () => {
  let component: ProfileSection;
  let fixture: ComponentFixture<ProfileSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
