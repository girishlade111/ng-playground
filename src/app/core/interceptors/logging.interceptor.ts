import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { HttpLogEntry } from '../models/http-log.model';
import { inject } from '@angular/core';
import { HttpLogService } from '../services/http-log.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logService = inject(HttpLogService);
  const startTime = Date.now();

  logService.addEntry({
    method: req.method,
    url: req.urlWithParams,
    timestamp: new Date(),
    status: 'pending',
  });

  return next(req).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          logService.updateLastEntry({
            status: event.status,
            duration,
            responseSize: event.body ? JSON.stringify(event.body).length : 0,
          });
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        logService.updateLastEntry({
          status: error.status || 0,
          duration,
          error: error.message || 'Unknown error',
        });
      },
    })
  );
};