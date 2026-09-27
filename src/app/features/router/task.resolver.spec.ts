import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { taskResolver } from './task.resolver';
import { TaskApiService } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';

const mockTask: Task = {
  id: '1',
  title: 'Set up project structure',
  description: 'Initialize Angular project',
  status: 'done',
  createdAt: new Date('2024-01-15'),
};

function snapshotForId(id: string): ActivatedRouteSnapshot {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.params = { id };
  return snapshot;
}

function runResolver(id: string): Observable<Task | RedirectCommand> {
  // The resolver implementation always returns an Observable; the cast only
  // narrows the ResolveFn's broad MaybeAsync<T> signature for the test.
  return TestBed.runInInjectionContext(() =>
    taskResolver(snapshotForId(id), {} as RouterStateSnapshot)
  ) as Observable<Task | RedirectCommand>;
}

describe('taskResolver', () => {
  function setup(getById: (id: string) => ReturnType<TaskApiService['getById']>) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TaskApiService, useValue: { getById } }],
    });
  }

  it('should return the task when the backend resolves it', (done) => {
    setup(() => of(mockTask));
    runResolver('1').subscribe((result) => {
      expect(result).toEqual(mockTask);
      done();
    });
  });

  it('should redirect to /router when the task is not found (no navigation crash)', (done) => {
    setup(() =>
      throwError(
        () => new HttpErrorResponse({ status: 404, statusText: 'Task with id 999 not found' })
      )
    );
    const router = TestBed.inject(Router);
    runResolver('999').subscribe((result) => {
      expect(result instanceof RedirectCommand).toBeTrue();
      expect((result as RedirectCommand).redirectTo.toString()).toBe('/router');
      expect(router.parseUrl('/router').toString()).toBe(
        (result as RedirectCommand).redirectTo.toString()
      );
      done();
    });
  });

  it('should redirect to /router when the backend errors', (done) => {
    setup(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    runResolver('1').subscribe((result) => {
      expect(result instanceof RedirectCommand).toBeTrue();
      expect((result as RedirectCommand).redirectTo.toString()).toBe('/router');
      done();
    });
  });
});
