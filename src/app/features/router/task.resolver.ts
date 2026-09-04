import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { TaskApiService } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';

export const taskResolver: ResolveFn<Task> = (route: ActivatedRouteSnapshot) => {
  const taskApiService = inject(TaskApiService);
  const taskId = route.paramMap.get('id')!;
  return taskApiService.getById(taskId);
};