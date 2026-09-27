import { ResolveFn, ActivatedRouteSnapshot, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskApiService } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';

export const taskResolver: ResolveFn<Task | RedirectCommand> = (
  route: ActivatedRouteSnapshot
): Observable<Task | RedirectCommand> => {
  const taskApiService = inject(TaskApiService);
  const router = inject(Router);
  const taskId = route.paramMap.get('id') ?? '';

  // A failed fetch (unknown id, backend error) must not break navigation:
  // redirect to the router demo index instead of failing the route.
  // Note: resolvers must return a RedirectCommand (not a plain UrlTree) —
  // the router only treats RedirectCommand as a redirect; a UrlTree would
  // be stored as resolved data and bound to the component input.
  return taskApiService
    .getById(taskId)
    .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/router')))));
};
