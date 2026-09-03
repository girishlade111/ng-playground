import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private tasks: Task[] = [
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

  private simulateDelay(): number {
    return 300 + Math.random() * 500;
  }

  private shouldSimulateError(): boolean {
    return Math.random() < 0.1;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getAll(): Observable<Task[]> {
    const delayMs = this.simulateDelay();
    if (this.shouldSimulateError()) {
      return throwError(() => new Error('Failed to fetch tasks. Please try again.')).pipe(delay(delayMs));
    }
    return of([...this.tasks]).pipe(delay(delayMs));
  }

  getById(id: string): Observable<Task> {
    const delayMs = this.simulateDelay();
    if (this.shouldSimulateError()) {
      return throwError(() => new Error(`Failed to fetch task ${id}. Please try again.`)).pipe(delay(delayMs));
    }
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      return throwError(() => new Error(`Task with id ${id} not found`)).pipe(delay(delayMs));
    }
    return of({ ...task }).pipe(delay(delayMs));
  }

  create(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const delayMs = this.simulateDelay();
    if (this.shouldSimulateError()) {
      return throwError(() => new Error('Failed to create task. Please try again.')).pipe(delay(delayMs));
    }
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.tasks = [...this.tasks, newTask];
    return of(newTask).pipe(delay(delayMs));
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<Task> {
    const delayMs = this.simulateDelay();
    if (this.shouldSimulateError()) {
      return throwError(() => new Error('Failed to update task. Please try again.')).pipe(delay(delayMs));
    }
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Task with id ${id} not found`)).pipe(delay(delayMs));
    }
    const updatedTask = { ...this.tasks[index], ...updates };
    this.tasks = [...this.tasks.slice(0, index), updatedTask, ...this.tasks.slice(index + 1)];
    return of(updatedTask).pipe(delay(delayMs));
  }

  delete(id: string): Observable<void> {
    const delayMs = this.simulateDelay();
    if (this.shouldSimulateError()) {
      return throwError(() => new Error('Failed to delete task. Please try again.')).pipe(delay(delayMs));
    }
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Task with id ${id} not found`)).pipe(delay(delayMs));
    }
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return of(void 0).pipe(delay(delayMs));
  }
}