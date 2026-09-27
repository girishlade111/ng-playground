import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../services/toast.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should surface the backend message for a 404 and rethrow with the status intact', (done) => {
    spyOn(toast, 'error');
    let captured: HttpErrorResponse | undefined;

    http.get('/api/tasks/999').subscribe({
      error: (err: HttpErrorResponse) => {
        captured = err;
        done();
      },
    });

    const req = httpMock.expectOne('/api/tasks/999');
    req.flush({ message: 'Task with id 999 not found' }, { status: 404, statusText: 'Not Found' });

    expect(toast.error).toHaveBeenCalledWith('Not Found', 'Task with id 999 not found');
    expect(captured).toBeTruthy();
    expect(captured?.status).toBe(404);
  });

  it('should surface the backend message for a 500 and rethrow with the status intact', (done) => {
    spyOn(toast, 'error');
    let captured: HttpErrorResponse | undefined;

    http.get('/api/tasks/error').subscribe({
      error: (err: HttpErrorResponse) => {
        captured = err;
        done();
      },
    });

    const req = httpMock.expectOne('/api/tasks/error');
    req.flush(
      { message: 'Simulated server failure' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    expect(toast.error).toHaveBeenCalledWith('Server Error', 'Simulated server failure');
    expect(captured?.status).toBe(500);
  });

  it('should not reference browser-only globals (SSR-safe)', () => {
    // Regression guard: the interceptor must evaluate without touching
    // ErrorEvent, which does not exist in Node.js SSR.
    spyOn(toast, 'error');
    let completed = false;

    http.get('/api/tasks').subscribe({
      error: () => {
        completed = true;
      },
    });

    const req = httpMock.expectOne('/api/tasks');
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(completed).toBeTrue();
    expect(toast.error).toHaveBeenCalled();
  });
});
