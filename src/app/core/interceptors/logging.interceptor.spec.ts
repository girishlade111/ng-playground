import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loggingInterceptor } from './logging.interceptor';
import { HttpLogService } from '../services/http-log.service';

describe('loggingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logService: HttpLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loggingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    logService = TestBed.inject(HttpLogService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log a successful request with status and duration', () => {
    http.get('/api/tasks').subscribe();

    const req = httpMock.expectOne('/api/tasks');
    req.flush([{ id: '1' }]);

    const entries = logService.entries();
    expect(entries.length).toBe(1);
    expect(entries[0].method).toBe('GET');
    expect(entries[0].url).toBe('/api/tasks');
    expect(entries[0].status).toBe(200);
    expect(entries[0].duration).toBeGreaterThanOrEqual(0);
    expect(entries[0].id).toBeTruthy();
  });

  it('should update the correct entry when concurrent requests complete out of order', () => {
    // Regression test: the interceptor used to update "the last entry",
    // which corrupted the log when a later request finished first.
    http.get('/api/first').subscribe({ error: () => undefined });
    http.get('/api/second').subscribe();

    const [first, second] = httpMock.match(() => true);
    expect(first.request.url).toBe('/api/first');
    expect(second.request.url).toBe('/api/second');

    // Complete the SECOND request first, then fail the FIRST.
    second.flush({ ok: true });
    first.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    const entries = logService.entries();
    expect(entries.length).toBe(2);
    expect(entries[0].url).toBe('/api/first');
    expect(entries[0].status).toBe(500);
    expect(entries[0].error).toBeTruthy();
    expect(entries[1].url).toBe('/api/second');
    expect(entries[1].status).toBe(200);
    expect(entries[1].error).toBeUndefined();
    expect(entries[0].id).not.toBe(entries[1].id);
  });
});
