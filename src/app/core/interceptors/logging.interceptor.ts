import { HttpInterceptorFn, HttpResponse, HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpLogService } from '../services/http-log.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logService = inject(HttpLogService);
  const startTime = Date.now();

  // Capture the entry id so concurrent requests update their own entry —
  // updating "the last entry" would corrupt the log when responses arrive
  // out of order.
  const entryId = logService.addEntry({
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
          logService.updateEntry(entryId, {
            status: event.status,
            duration,
            responseSize: event.body ? JSON.stringify(event.body).length : 0,
          });
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        logService.updateEntry(entryId, {
          status: error.status || 0,
          duration,
          error: error.message || 'Unknown error',
        });
      },
    })
  );
};
