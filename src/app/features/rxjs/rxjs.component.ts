import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, combineLatest, startWith, tap, catchError, of } from 'rxjs';
import { TaskApiService, TaskFilter } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <section class="space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">RxJS</h1>
        <p class="text-slate-700">Observables, Subjects, operators, and interop with signals (toSignal / toObservable).</p>
      </header>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Search with Filters (combineLatest + switchMap)</h2>
        <p class="text-slate-600 mb-6">
          Debounced search input combined with category filter. Uses <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">combineLatest</code>
          to merge streams and <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">switchMap</code> to cancel stale requests automatically.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Search</label>
            <input
              type="text"
              [formControl]="searchControl"
              placeholder="Search tasks by title or description..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              [formControl]="categoryControl"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <span
            [class]="loading() ? 'inline-flex items-center gap-2 text-indigo-600' : 'inline-flex items-center gap-2 text-slate-400'"
          >
            @if (loading()) {
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" />
                <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
              </svg>
              <span>Loading...</span>
            } @else {
              <span>Ready</span>
            }
          </span>
          <span class="text-sm text-slate-500">Results: {{ filteredTasks().length }}</span>
        </div>

        @if (error()) {
          <div class="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {{ error() }}
          </div>
        }

        <div class="rounded-lg border border-slate-200 bg-slate-50 max-h-96 overflow-auto">
          @if (filteredTasks().length === 0 && !loading()) {
            <div class="p-8 text-center text-slate-500">No tasks found</div>
          } @else {
            <ul class="divide-y divide-slate-200">
              @for (task of filteredTasks(); track task.id) {
                <li class="p-4 hover:bg-white transition-colors">
                  <div class="flex items-start gap-3">
                    <span
                      class="inline-flex items-center justify-center w-2 h-2 mt-2 rounded-full"
                      [class.bg-green-500]="task.status === 'done'"
                      [class.bg-yellow-500]="task.status === 'in-progress'"
                      [class.bg-slate-400]="task.status === 'todo'"
                    ></span>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-slate-900 truncate">{{ task.title }}</h3>
                      <p class="text-sm text-slate-500 mt-0.5 truncate">{{ task.description }}</p>
                      <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">{{ task.status }}</span>
                        <span class="text-xs text-slate-400">{{ task.createdAt | date: 'shortDate' }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      </section>
    </section>
  `,
})
export default class RxjsComponent implements OnInit {
  private taskApi = inject(TaskApiService);
  private destroyRef = inject(DestroyRef);

  searchControl = new FormControl('', { nonNullable: true });
  categoryControl = new FormControl<'all' | 'todo' | 'in-progress' | 'done'>('all', { nonNullable: true });

  filteredTasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      })
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith('all' as const),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      })
    );

    const filter$ = combineLatest([search$, category$]).pipe(
      switchMap(([search, category]) => {
        const filter: TaskFilter = { search, category: category === 'all' ? undefined : category };
        return this.taskApi.getFiltered(filter).pipe(
          catchError((err) => {
            this.error.set(err.message);
            return of([] as Task[]);
          }),
          tap(() => this.loading.set(false))
        );
      })
    );

    const subscription = filter$.subscribe((tasks) => {
      this.filteredTasks.set(tasks);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}