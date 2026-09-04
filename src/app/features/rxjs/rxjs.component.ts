import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, map, filter, tap, Subscription, combineLatest, switchMap, startWith, debounceTime, distinctUntilChanged, Subject, of, catchError } from 'rxjs';
import { TaskApiService } from '../../shared/services/task-api.service';
import { Task } from '../../shared/services/task.model';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6 max-w-xl">
      <h1 class="text-3xl font-bold text-indigo-600">RxJS · interval / map / filter</h1>
      <p class="text-slate-700">
        Live ticking counter using <code class="rounded bg-slate-100 px-1">interval()</code>,
        <code class="rounded bg-slate-100 px-1">map()</code>, and
        <code class="rounded bg-slate-100 px-1">filter()</code> with proper subscription cleanup.
      </p>

      <!-- Operator Pipeline Visualization -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-4 border border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800">Operator Pipeline</h2>
        <div class="space-y-3 font-mono text-sm">
          <div class="flex items-center gap-3 text-slate-600">
            <span class="rounded-md bg-indigo-50 px-2 py-1 text-indigo-700">interval(1000)</span>
            <span class="text-slate-400">→</span>
            <span class="text-slate-500">Emits 0, 1, 2, 3… every 1s</span>
          </div>
          <div class="flex items-center gap-3 text-slate-600 pl-10">
            <span class="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">map(x => x * 2)</span>
            <span class="text-slate-400">→</span>
            <span class="text-slate-500">Doubles each value: 0, 2, 4, 6…</span>
          </div>
          <div class="flex items-center gap-3 text-slate-600 pl-10">
            <span class="rounded-md bg-amber-50 px-2 py-1 text-amber-700">filter(x => x % 4 === 0)</span>
            <span class="text-slate-400">→</span>
            <span class="text-slate-500">Keeps only multiples of 4: 0, 4, 8, 12…</span>
          </div>
        </div>
      </div>

      <!-- Live Ticker Display -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-5 border border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800">Live Output</h2>

        <div class="text-center">
          <div class="text-sm uppercase tracking-wide text-slate-500">Current Value</div>
          <div
            data-testid="ticker-value"
            class="mt-2 text-7xl font-bold tabular-nums text-indigo-600 transition-colors duration-200"
            [class.text-emerald-600]="isEven()"
            [class.text-amber-600]="!isEven() && value() !== 0"
          >
            {{ value() }}
          </div>
          <div class="mt-2 text-sm text-slate-500">
            @if (isRunning()) {
              <span class="inline-flex items-center gap-1 text-emerald-600">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Running
              </span>
            } @else {
              <span class="text-slate-400">Stopped</span>
            }
          </div>
        </div>

        <div class="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            (click)="start()"
            [disabled]="isRunning()"
            class="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start
          </button>
          <button
            type="button"
            (click)="stop()"
            [disabled]="!isRunning()"
            class="rounded-lg bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Stop
          </button>
          <button
            type="button"
            (click)="reset()"
            class="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-300 active:bg-slate-400 transition-colors"
          >
            Reset
          </button>
        </div>

        <div class="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <strong>Subscription status:</strong>
          <span class="ml-2" [class.text-emerald-600]="isRunning()" [class.text-rose-600]="!isRunning()">
            {{ isRunning() ? 'Active (subscribed)' : 'Inactive (unsubscribed)' }}
          </span>
        </div>
      </div>

      <!-- Emission Log -->
      <div class="rounded-xl bg-white p-6 shadow-md border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-slate-800">Emission Log (last 10)</h2>
          <button
            type="button"
            (click)="clearLog()"
            class="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 active:bg-slate-400 transition-colors"
          >
            Clear log
          </button>
        </div>
        <div
          data-testid="emission-log"
          class="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-700 space-y-1"
        >
          @if (log().length === 0) {
            <div class="text-slate-400 italic px-1">No emissions yet — click Start</div>
          } @else {
            @for (entry of log(); track $index) {
              <div class="flex gap-3">
                <span class="shrink-0 text-slate-400 tabular-nums">{{ entry.time }}</span>
                <span class="shrink-0 text-slate-500">{{ entry.operator }}</span>
                <span class="text-slate-800">{{ entry.value }}</span>
              </div>
            }
          }
        </div>
      </div>

      <!-- Cleanup Verification -->
      <div class="rounded-xl bg-white p-6 shadow-md border border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Subscription Cleanup Verification</h2>
        <div class="space-y-2 text-sm text-slate-700">
          <div class="flex items-center gap-2">
            <span class="rounded-full h-2 w-2 bg-emerald-500"></span>
            <span>Uses <code class="rounded bg-slate-100 px-1">takeUntilDestroyed()</code> for automatic cleanup on component destroy</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full h-2 w-2 bg-emerald-500"></span>
            <span>Manual <code class="rounded bg-slate-100 px-1">unsubscribe()</code> on Stop/Reset via <code class="rounded bg-slate-100 px-1">Subscription</code></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full h-2 w-2 bg-emerald-500"></span>
            <span>No memory leaks — verified via <code class="rounded bg-slate-100 px-1">DestroyRef</code></span>
          </div>
        </div>
      </div>

      <!-- combineLatest + switchMap Search Demo -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-6 border border-slate-200">
        <h2 class="text-2xl font-bold text-indigo-600">RxJS · Search with Filters</h2>
        <p class="text-slate-700">
          Live search using <code class="rounded bg-slate-100 px-1">combineLatest()</code> +
          <code class="rounded bg-slate-100 px-1">switchMap()</code> — debounced text input + category filter,
          cancelling in-flight requests when new values arrive.
        </p>

        <!-- Controls -->
        <div class="rounded-lg bg-slate-50 p-4 space-y-4">
          <div>
            <label for="search-input" class="block text-sm font-medium text-slate-700 mb-1">Search tasks</label>
            <input
              id="search-input"
              type="text"
              [value]="searchQuery()"
              (input)="onSearchQueryChange($any($event.target).value)"
              placeholder="Type to search titles…"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="search-category" class="block text-sm font-medium text-slate-700 mb-1">Filter by status</label>
            <select
              id="search-category"
              [value]="searchCategory()"
              (change)="onSearchCategoryChange($any($event.target).value)"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <!-- Loading / Error State -->
        @if (searchLoading()) {
          <div class="rounded-lg border border-slate-200 bg-white p-8 text-center" role="status" aria-live="polite">
            <div class="inline-flex items-center gap-3 text-slate-600">
              <svg class="h-6 w-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Searching…</span>
            </div>
          </div>
        } @else if (searchError()) {
          <div class="rounded-lg bg-red-50 border border-red-200 p-4" role="alert">
            <div class="flex items-center gap-3">
              <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <p class="text-red-700">{{ searchError() }}</p>
            </div>
          </div>
        } @else {
          <!-- Results Table -->
          <div class="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full" role="grid">
                <thead class="bg-slate-50">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  @for (task of searchResults(); track task.id) {
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-mono text-slate-500">{{ task.id }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ task.title }}</td>
                      <td class="px-4 py-3">
                        <span [class]="getStatusClass(task.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ formatStatus(task.status) }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm text-slate-500">{{ formatDate(task.createdAt) }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="px-4 py-8 text-center text-slate-500">
                        No tasks match your search.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
              Showing {{ searchResults().length }} task{{ searchResults().length !== 1 ? 's' : '' }}
            </div>
          </div>
        }

        <!-- Pipeline Visualization -->
        <div class="rounded-lg bg-slate-50 p-4 space-y-3">
          <h3 class="text-sm font-semibold text-slate-800">Pipeline</h3>
          <div class="space-y-2 font-mono text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-indigo-50 px-2 py-1 text-indigo-700">searchQuery$</span>
              <span class="text-slate-400">→</span>
              <span class="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">debounceTime(300)</span>
              <span class="text-slate-400">→</span>
              <span class="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">distinctUntilChanged()</span>
            </div>
            <div class="flex items-center gap-2 pl-10">
              <span class="rounded-md bg-amber-50 px-2 py-1 text-amber-700">searchCategory$</span>
              <span class="text-slate-400">→</span>
              <span class="text-slate-500">(no debounce)</span>
            </div>
            <div class="flex items-center gap-2 pl-10">
              <span class="rounded-md bg-rose-50 px-2 py-1 text-rose-700">combineLatest([query, category])</span>
              <span class="text-slate-400">→</span>
              <span class="text-slate-500">Emits when either changes</span>
            </div>
            <div class="flex items-center gap-2 pl-10">
              <span class="rounded-md bg-purple-50 px-2 py-1 text-purple-700">switchMap(fetch & filter)</span>
              <span class="text-slate-400">→</span>
              <span class="text-slate-500">Cancels previous, runs latest</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class RxjsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly taskApi = inject(TaskApiService);

  protected readonly value = signal(0);
  protected readonly isRunning = signal(false);
  protected readonly log = signal<
    readonly { time: string; operator: string; value: string }[]
  >([]);

  private subscription?: Subscription;

  protected isEven = signal(true);

  // Search with filters demo
  protected readonly searchQuery = signal('');
  protected readonly searchCategory = signal<'all' | 'todo' | 'in-progress' | 'done'>('all');
  protected readonly searchResults = signal<Task[]>([]);
  protected readonly searchLoading = signal(false);
  protected readonly searchError = signal<string | null>(null);

  private readonly searchQuery$ = new Subject<string>();
  private readonly searchCategory$ = new Subject<'all' | 'todo' | 'in-progress' | 'done'>();

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchQuery$.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
      this.searchCategory$.pipe(startWith('all' as const)),
    ])
      .pipe(
        switchMap(([query, category]) => {
          this.searchLoading.set(true);
          this.searchError.set(null);
          return this.taskApi.getAll().pipe(
            map((tasks: Task[]) => {
              let filtered: Task[] = tasks;
              if (query.trim()) {
                const q = query.toLowerCase();
                filtered = filtered.filter((t: Task) => t.title.toLowerCase().includes(q));
              }
              if (category !== 'all') {
                filtered = filtered.filter((t: Task) => t.status === category);
              }
              return filtered;
            }),
            catchError((err) => {
              this.searchError.set(err.message);
              return of([] as Task[]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (results) => {
          this.searchResults.set(results);
          this.searchLoading.set(false);
        },
        error: () => {
          this.searchLoading.set(false);
        },
      });
  }

  protected onSearchQueryChange(value: string): void {
    this.searchQuery.set(value);
    this.searchQuery$.next(value);
  }

  protected onSearchCategoryChange(value: 'all' | 'todo' | 'in-progress' | 'done'): void {
    this.searchCategory.set(value);
    this.searchCategory$.next(value);
  }

  protected start(): void {
    if (this.isRunning() || this.subscription?.closed === false) {
      return;
    }

    this.isRunning.set(true);
    this.log.set([]);

    this.subscription = interval(1000)
      .pipe(
        tap((x) => this.addLog('interval', x)),
        map((x) => x * 2),
        tap((x) => this.addLog('map (×2)', x)),
        filter((x) => x % 4 === 0),
        tap((x) => this.addLog('filter (%4===0)', x)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (v) => {
          this.value.set(v);
          this.isEven.set(v % 2 === 0);
        },
        complete: () => {
          this.isRunning.set(false);
          this.subscription = undefined;
        },
      });
  }

  protected stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.isRunning.set(false);
  }

  protected reset(): void {
    this.stop();
    this.value.set(0);
    this.isEven.set(true);
    this.log.set([]);
  }

  protected clearLog(): void {
    this.log.set([]);
  }

  private addLog(operator: string, val: number): void {
    const time = new Date().toISOString().slice(11, 23);
    this.log.update((current) => {
      const next = [...current, { time, operator, value: String(val) }];
      return next.length > 10 ? next.slice(next.length - 10) : next;
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
      default:
        return status;
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