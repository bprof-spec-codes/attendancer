import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';
import { MockDataService } from '../services/mock-data.service';
import { of } from 'rxjs';
import { MockDataInterceptor } from './mock-data-interceptor';

describe('MockDataInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MockDataService', [
      'getEventById',
      'getParticipantsByEventId',
      'getEventGroupsWithMetadataByUserId',
      'getEventsByUserId',
      'postEvent'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MockDataService, useValue: spy },
        { provide: HTTP_INTERCEPTORS, useClass: MockDataInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    mockDataService = TestBed.inject(MockDataService) as jasmine.SpyObj<MockDataService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('01 - should return mock event for GET /api/Event/:id', (done) => {
    const mockEvent = { name: '1. DevOps labor', metadata: ['Seat'] };
    mockDataService.getEventById.and.returnValue(of(mockEvent));

    http.get('/api/Event/1').subscribe({
      next: (res: any) => {
        expect(res.name).toBe('1. DevOps labor');
        expect(res.metadata).toContain('Seat');
        done();
      },
      error: () => fail('GET /api/Event/:id should not fail')
    });
  });

  it('02 - should return mock participants for GET /api/Participant/:eventid', (done) => {
    const mockParticipants = [
      { username: 'Gipsz Jakab', present: true, metadata: ['JMAH67'] }
    ];
    mockDataService.getParticipantsByEventId.and.returnValue(of(mockParticipants));

    http.get<any[]>('/api/Participant/1').subscribe({
      next: (res: any[]) => {
        expect(res.length).toBe(1);
        expect(res[0].username).toBe('Gipsz Jakab');
        done();
      },
      error: () => fail('GET /api/Participant/:eventid should not fail')
    });
  });

  it('03 - should return mock event groups for GET /api/EventGroup/:userid', (done) => {
    const mockGroups = [
      { id: 'sdfga32sfd', name: 'Angular', metadata: ['Email'] }
    ];
    mockDataService.getEventGroupsWithMetadataByUserId.and.returnValue(of(mockGroups));

    http.get<any>('/api/EventGroup/1').subscribe({
      next: (res: any[]) => {
        expect(res.length).toBe(1);
        expect(res[0].name).toBe('Angular');
        expect(res[0].metadata).toContain('Email');
        done();
      },
      error: () => fail('GET /api/EventGroup/:userid should not fail')
    });
  });

  it('04 - should return mock events for GET /api/Event/ByUser/:userid', (done: DoneFn) => {
  const mockEvents = [
    { id: 'fsd4535fdgs54wdsa', name: 'ZYX Megbeszélés', metadata: ['Email'] }
  ];
  mockDataService.getEventsByUserId.and.returnValue(of(mockEvents));
  
  http.get<any[]>('/api/Event/ByUser/2').subscribe({
    next: (res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('ZYX Megbeszélés');
      expect(res[0].metadata).toContain('Email');
      done();
    },
    error: (err) => {
      fail('GET /api/Event/ByUser/:userid should not fail. Error: ' + err);
      done();
    }
  });
});

  it('05 - should handle POST /api/Event and call postEvent', (done) => {
  const consoleSpy = spyOn(console, 'log');
  const newEvent = { name: 'Teszt esemény', eventGroupId: '123', metadata: ['Neptun code'] };
  
  http.post<any>('/api/Event', newEvent, { observe: 'response' }).subscribe({
    next: (res: HttpResponse<any>) => {
      expect(mockDataService.postEvent).toHaveBeenCalledWith(newEvent);
      expect(res.status).toBe(201);
      expect(consoleSpy).not.toHaveBeenCalled();
      done();
    },
    error: () => fail('POST /api/Event should not fail')
  });
});

  it('06 - should pass through non-mocked URLs', () => {
    http.get('/api/User').subscribe();
    const req = httpMock.expectOne('/api/User');
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });


it('07 - should not add Authorization header when token does not exist', () => {
  spyOn(localStorage, 'getItem').and.returnValue(null);
  
  http.get('/api/AnotherEndpoint').subscribe();
  
  const req = httpMock.expectOne('/api/AnotherEndpoint');
  expect(req.request.headers.has('Authorization')).toBeFalse();
  req.flush({ ok: true });
});

it('08 - should add Authorization header to mocked requests', (done) => {
 spyOn(localStorage, 'getItem').and.returnValue('test-token-456');
  
  const mockEvent = { 
    name: '1. DevOps labor', 
    eventGroupId: 'dasgf',
    metadata: ['Neptun code', 'Seat'] 
  };
  mockDataService.getEventById.and.returnValue(of(mockEvent));
  
  http.get('/api/Event/1').subscribe({
    next: (res: any) => {
      expect(res.name).toBe('1. DevOps labor');
      expect(res.metadata).toContain('Neptun code');
      done();
    },
    error: () => fail('Mocked request should not fail')
  });
});
});



