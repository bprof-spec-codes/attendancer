import { TestBed } from '@angular/core/testing';

import { EditEventService } from './edit-event-service';

describe('Event', () => {
  let service: EditEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
