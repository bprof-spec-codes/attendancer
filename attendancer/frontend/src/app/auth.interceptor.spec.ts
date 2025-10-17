import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ellenőrizni hogy ne legyen függőben lévő kérés.
    httpTestingController.verify();
    localStorage.removeItem('AuthToken');
  });

  it('should attach the Authorization header when token is set', () => {
    // test-token
    // /test-url

    localStorage.setItem('AuthToken', 'test-token');

    httpClient.get('/test-url').subscribe();

    const req = httpTestingController.expectOne('/test-url');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    // Üres object-el visszatérni.
    req.flush({});
  });

  it('should not attach the Authorization header when token is not set', () => {
    // test-token

    httpClient.get('/test-url').subscribe();

    const req = httpTestingController.expectOne('/test-url');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    // Üres object-el visszatérni.
    req.flush({});
  });
});
