import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let title = 'Request Failed';
      let message = 'An unexpected error occurred';

      // ErrorEvent is a browser-only API — guard it so this interceptor
      // also runs during SSR (Node.js has no ErrorEvent global).
      if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
        title = 'Network Error';
        message = `Network error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            title = 'Connection Error';
            message = 'Unable to connect to the server. Please check your network.';
            break;
          case 400:
            title = 'Bad Request';
            message = error.error?.message || 'Invalid request data';
            break;
          case 401:
            title = 'Unauthorized';
            message = 'Your session has expired. Please log in again.';
            break;
          case 403:
            title = 'Forbidden';
            message = 'You do not have permission to perform this action.';
            break;
          case 404:
            title = 'Not Found';
            message = error.error?.message || 'The requested resource was not found.';
            break;
          case 409:
            title = 'Conflict';
            message = error.error?.message || 'A conflict occurred with the current state.';
            break;
          case 422:
            title = 'Validation Error';
            message = error.error?.message || 'The provided data is invalid.';
            break;
          case 500:
            title = 'Server Error';
            message = error.error?.message || 'An internal server error occurred. Please try again later.';
            break;
          case 503:
            title = 'Service Unavailable';
            message = 'The service is temporarily unavailable. Please try again later.';
            break;
          default:
            message = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      toastService.error(title, message);

      return throwError(() => error);
    })
  );
};