import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError, delay } from 'rxjs';
import { Task } from '../../shared/services/task.model';

const API_PREFIX = '/api/tasks';

let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Set up project structure',
    description: 'Initialize Angular project with routing and Tailwind CSS',
    status: 'done',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Create Task API service',
    description: 'Build in-memory fake REST API for tasks',
    status: 'in-progress',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Implement CRUD UI',
    description: 'Build components for create, read, update, delete operations',
    status: 'todo',
    createdAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    title: 'Add error handling',
    description: 'Implement global error handling and user feedback',
    status: 'todo',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    title: 'Write unit tests',
    description: 'Add tests for TaskApiService and CRUD components',
    status: 'todo',
    createdAt: new Date('2024-01-19'),
  },
  {
    id: '6',
    title: 'Configure CI/CD pipeline',
    description: 'Set up GitHub Actions for build and test automation',
    status: 'todo',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '7',
    title: 'Document API endpoints',
    description: 'Create API documentation with examples',
    status: 'todo',
    createdAt: new Date('2024-01-21'),
  },
  {
    id: '8',
    title: 'Deploy to production',
    description: 'Deploy the application to Vercel',
    status: 'todo',
    createdAt: new Date('2024-01-22'),
  },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function simulateDelay(): number {
  return 300 + Math.random() * 500;
}

function shouldSimulateError(): boolean {
  return Math.random() < 0.1;
}

function createErrorResponse(message: string, status = 500): Observable<never> {
  return throwError(() => new Error(message)).pipe(delay(simulateDelay()));
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  if (!url.startsWith(API_PREFIX)) {
    return next(req);
  }

  const method = req.method;
  const id = url.replace(API_PREFIX + '/', '');

  switch (true) {
    case method === 'GET' && url === API_PREFIX:
      return handleGetAll();

    case method === 'GET' && url.startsWith(API_PREFIX + '/'):
      return handleGetById(id);

    case method === 'POST' && url === API_PREFIX:
      return handleCreate(req.body as Omit<Task, 'id' | 'createdAt'>);

    case method === 'PUT' && url.startsWith(API_PREFIX + '/'):
      return handleUpdate(id, req.body as Partial<Omit<Task, 'id' | 'createdAt'>>);

    case method === 'DELETE' && url.startsWith(API_PREFIX + '/'):
      return handleDelete(id);

    default:
      return next(req);
  }

  function handleGetAll(): Observable<HttpEvent<Task[]>> {
    if (shouldSimulateError()) {
      return createErrorResponse('Failed to fetch tasks. Please try again.');
    }
    return of(new HttpResponse({ status: 200, body: [...mockTasks] })).pipe(delay(simulateDelay()));
  }

  function handleGetById(taskId: string): Observable<HttpEvent<Task>> {
    if (shouldSimulateError()) {
      return createErrorResponse(`Failed to fetch task ${taskId}. Please try again.`);
    }
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) {
      return createErrorResponse(`Task with id ${taskId} not found`, 404);
    }
    return of(new HttpResponse({ status: 200, body: { ...task } })).pipe(delay(simulateDelay()));
  }

  function handleCreate(taskData: Omit<Task, 'id' | 'createdAt'>): Observable<HttpEvent<Task>> {
    if (shouldSimulateError()) {
      return createErrorResponse('Failed to create task. Please try again.');
    }
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
    };
    mockTasks = [...mockTasks, newTask];
    return of(new HttpResponse({ status: 201, body: newTask })).pipe(delay(simulateDelay()));
  }

  function handleUpdate(
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Observable<HttpEvent<Task>> {
    if (shouldSimulateError()) {
      return createErrorResponse('Failed to update task. Please try again.');
    }
    const index = mockTasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      return createErrorResponse(`Task with id ${taskId} not found`, 404);
    }
    const updatedTask = { ...mockTasks[index], ...updates };
    mockTasks = [...mockTasks.slice(0, index), updatedTask, ...mockTasks.slice(index + 1)];
    return of(new HttpResponse({ status: 200, body: updatedTask })).pipe(delay(simulateDelay()));
  }

  function handleDelete(taskId: string): Observable<HttpEvent<void>> {
    if (shouldSimulateError()) {
      return createErrorResponse('Failed to delete task. Please try again.');
    }
    const index = mockTasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      return createErrorResponse(`Task with id ${taskId} not found`, 404);
    }
    mockTasks = mockTasks.filter((t) => t.id !== taskId);
    return of(new HttpResponse({ status: 204, body: undefined })).pipe(delay(simulateDelay()));
  }
};