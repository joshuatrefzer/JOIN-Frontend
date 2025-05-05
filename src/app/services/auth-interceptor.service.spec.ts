import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AuthInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add Authorization header when token is present', () => {
    const testToken = 'test-token';
    localStorage.setItem('Token', testToken);

    httpClient.get('/test-endpoint').subscribe();

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Token ${testToken}`);
    req.flush({});
  });

  it('should NOT add Authorization header when token is missing', () => {
    httpClient.get('/test-endpoint').subscribe();

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should redirect to root on 401 Unauthorized', () => {
    localStorage.setItem('Token', 'expired-token');

    httpClient.get('/secure-endpoint').subscribe({
      error: () => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
      }
    });

    const req = httpMock.expectOne('/secure-endpoint');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
