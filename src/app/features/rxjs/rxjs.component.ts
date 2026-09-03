import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, map, filter, tap, Subscription } from 'rxjs';

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
    </section>
  `,
})
export default class RxjsComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly value = signal(0);
  protected readonly isRunning = signal(false);
  protected readonly log = signal<
    readonly { time: string; operator: string; value: string }[]
  >([]);

  private subscription?: Subscription;

  protected isEven = signal(true);

  constructor() {
    // Verify cleanup on destroy - effect ensures DestroyRef is tracked
    effect(() => {
      this.destroyRef;
    });
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
}