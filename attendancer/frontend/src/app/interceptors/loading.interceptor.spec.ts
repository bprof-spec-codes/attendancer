import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

describe('LoadingInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let loadingSpinner: jasmine.SpyObj<LoadingSpinner>;

  beforeEach(() => {
    loadingSpinner = jasmine.createSpyObj('LoadingSpinner', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true
        },
        { provide: LoadingSpinner, useValue: loadingSpinner }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ellenőrizni hogy ne legyen függőben lévő kérés.
    httpTestingController.verify();
  });

  it('should show the spinner when a request is made', () => {
    const testUrl = '/test-url';
    httpClient.get(testUrl).subscribe();

    // Visszatérés szimulálása.
    httpTestingController.expectOne(testUrl).flush({});

    // Assert.
    expect(loadingSpinner.show).toHaveBeenCalled();
  });

  it('should hide the spinner when a request succeeds', () => {
    const testUrl = '/test-url';
    httpClient.get(testUrl).subscribe();

    // Sikeres visszatérés szimulálása.
    httpTestingController.expectOne(testUrl).flush({ data: 'test data' });

    // Assert.
    expect(loadingSpinner.hide).toHaveBeenCalled();
  });

  it('should hide the spinner when a request fails', () => {
    const testUrl = '/test-url';
    httpClient.get(testUrl).subscribe(() => {}, () => {});

    // Hibás visszatérés szimulálása.
    httpTestingController.expectOne(testUrl).flush('Error', { status: 500, statusText: 'Server Error' });

    // Assert.
    expect(loadingSpinner.hide).toHaveBeenCalled();
  });
});
