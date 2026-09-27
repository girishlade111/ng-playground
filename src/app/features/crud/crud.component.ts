import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskApiService } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">CRUD</h1>
        <p class="text-slate-700 mt-1">Create, Read, Update, Delete with HttpClient and signals.</p>
      </header>

      @if (error()) {
        <div class="rounded-lg bg-red-50 border border-red-200 p-4" role="alert">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-red-700">{{ error() }}</p>
            <button
              type="button"
              class="ml-auto text-sm text-red-600 hover:text-red-800 underline"
              (click)="loadTasks()"
            >
              Retry
            </button>
          </div>
        </div>
      }

      <form [formGroup]="createForm" (ngSubmit)="onCreate()" class="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4 sm:items-end">
        <div class="sm:col-span-1">
          <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter task title"
          />
          @if (createForm.get('title')?.invalid && createForm.get('title')?.touched) {
            <p class="mt-1 text-sm text-red-600">Title is required (max 100 characters)</p>
          }
        </div>

        <div class="sm:col-span-1">
          <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="2"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter task description (optional)"
          ></textarea>
        </div>

        <div class="sm:col-span-1">
          <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            id="status"
            formControlName="status"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          type="submit"
          [disabled]="createForm.invalid || creating()"
          class="sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          @if (creating()) {
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating...
          } @else {
            Create Task
          }
        </button>
      </form>

      @if (loading()) {
        <div class="rounded-lg border border-slate-200 bg-white p-8 text-center" role="status" aria-live="polite">
          <div class="inline-flex items-center gap-3 text-slate-600">
            <svg class="h-6 w-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Loading tasks...</span>
          </div>
        </div>
      } @else {
        <div class="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full" role="grid">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                @for (task of tasks(); track task.id) {
                  @if (editing() === task.id) {
                    <tr class="bg-indigo-50">
                      <td class="px-4 py-3 text-sm font-mono text-slate-500">{{ task.id }}</td>
                      <td class="px-4 py-3">
                        <form [formGroup]="editForm" (ngSubmit)="onSaveEdit(task)" class="space-y-2">
                          <input
                            type="text"
                            formControlName="title"
                            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                          @if (editForm.get('title')?.invalid && editForm.get('title')?.touched) {
                            <p class="text-xs text-red-600">Title is required (max 100 characters)</p>
                          }
                          <textarea
                            formControlName="description"
                            rows="2"
                            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                          ></textarea>
                          <select
                            formControlName="status"
                            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                          <div class="flex items-center gap-2 pt-1">
                            <button
                              type="submit"
                              [disabled]="editForm.invalid"
                              class="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              (click)="onCancelEdit()"
                              class="inline-flex items-center justify-center gap-2 rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                      <td colspan="3" class="px-4 py-3"></td>
                    </tr>
                  } @else {
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-mono text-slate-500">{{ task.id }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ task.title }}</td>
                      <td class="px-4 py-3">
                        <span [class]="getStatusClass(task.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ formatStatus(task.status) }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm text-slate-500">{{ formatDate(task.createdAt) }}</td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            (click)="onEdit(task)"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            class="text-red-600 hover:text-red-900 text-sm font-medium"
                            (click)="onDelete(task)"
                            [disabled]="deleting() === task.id"
                          >
                            @if (deleting() === task.id) {
                              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            } @else {
                              Delete
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                } @empty {
                  <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-slate-500">
                      No tasks found. Create your first task above!
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
            Showing {{ tasks().length }} task{{ tasks().length !== 1 ? 's' : '' }}
          </div>
        </div>
      }
    </section>
  `,
})
export default class CrudComponent implements OnInit {
  private readonly taskApi = inject(TaskApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(false);
  protected readonly creating = signal(false);
  protected readonly deleting = signal<string | null>(null);
  protected readonly editing = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    status: ['todo' as const],
  });

  protected readonly editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    status: ['todo' as Task['status']],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskApi.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected onCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    const { title, description, status } = this.createForm.getRawValue();

    this.taskApi.create({ title, description, status }).subscribe({
      next: (newTask) => {
        this.tasks.update((current) => [newTask, ...current]);
        this.createForm.reset({ title: '', description: '', status: 'todo' });
        this.creating.set(false);
        this.toast.success('Task created', `"${newTask.title}" has been added.`);
      },
      error: (err) => {
        this.error.set(err.message);
        this.creating.set(false);
      },
    });
  }

  protected onEdit(task: Task): void {
    this.editing.set(task.id);
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }

  protected onCancelEdit(): void {
    this.editing.set(null);
    this.editForm.reset({ title: '', description: '', status: 'todo' });
  }

  protected onSaveEdit(task: Task): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const previousTasks = this.tasks();
    const updatedTask = { ...task, ...this.editForm.getRawValue() };

    this.tasks.update((current) =>
      current.map((t) => (t.id === task.id ? updatedTask : t))
    );
    this.editing.set(null);

    this.taskApi.update(task.id, this.editForm.getRawValue()).subscribe({
      next: (savedTask) => {
        this.tasks.update((current) =>
          current.map((t) => (t.id === task.id ? savedTask : t))
        );
        this.toast.success('Task updated', `"${savedTask.title}" has been updated.`);
      },
      error: (err) => {
        this.tasks.set(previousTasks);
        this.toast.error('Update failed', err.message);
      },
    });
  }

  protected onDelete(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) {
      return;
    }

    this.deleting.set(task.id);

    this.taskApi.delete(task.id).subscribe({
      next: () => {
        this.tasks.update((current) => current.filter((t) => t.id !== task.id));
        this.deleting.set(null);
        this.toast.success('Task deleted', `"${task.title}" has been removed.`);
      },
      error: (err) => {
        this.error.set(err.message);
        this.deleting.set(null);
      },
    });
  }

  protected getStatusClass(status: Task['status']): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'done':
        return `${base} bg-green-100 text-green-800`;
      case 'in-progress':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'todo':
      default:
        return `${base} bg-slate-100 text-slate-800`;
    }
  }

  protected formatStatus(status: Task['status']): string {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      case 'done':
        return 'Done';
    }
  }

  protected formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}