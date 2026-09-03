import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6 max-w-xl">
      <h1 class="text-3xl font-bold text-indigo-600">Signals · Counter</h1>
      <p class="text-slate-700">
        Reactive counter using <code class="rounded bg-slate-100 px-1">signal()</code>,
        <code class="rounded bg-slate-100 px-1">.set()</code>,
        <code class="rounded bg-slate-100 px-1">.update()</code>, and
        <code class="rounded bg-slate-100 px-1">computed()</code>. No
        <code class="rounded bg-slate-100 px-1">zone.js</code> needed.
      </p>

      <div class="rounded-xl bg-white p-6 shadow-md space-y-5">
        <div class="text-center">
          <div class="text-sm uppercase tracking-wide text-slate-500">Current value</div>
          <div
            data-testid="count"
            class="mt-1 text-6xl font-bold tabular-nums"
            [class.text-indigo-600]="count() > 0"
            [class.text-rose-600]="count() < 0"
            [class.text-slate-700]="count() === 0"
          >
            {{ count() }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-md bg-slate-50 px-3 py-2">
            <div class="text-slate-500">Doubled</div>
            <div class="font-semibold text-slate-800" data-testid="doubled">{{ doubled() }}</div>
          </div>
          <div class="rounded-md bg-slate-50 px-3 py-2">
            <div class="text-slate-500">Parity</div>
            <div class="font-semibold text-slate-800" data-testid="parity">{{ parity() }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            (click)="decrement()"
            class="rounded-lg bg-rose-100 px-4 py-2 font-medium text-rose-700 hover:bg-rose-200 active:bg-rose-300 transition-colors"
          >
            − Decrement
          </button>
          <button
            type="button"
            (click)="incrementBy(1)"
            class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            + Increment
          </button>
          <button
            type="button"
            (click)="incrementBy(5)"
            class="rounded-lg bg-indigo-100 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
          >
            +5
          </button>
          <button
            type="button"
            (click)="reset()"
            class="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-300 active:bg-slate-400 transition-colors"
          >
            Reset (set 0)
          </button>
          <button
            type="button"
            (click)="setRandom()"
            class="rounded-lg bg-emerald-100 px-4 py-2 font-medium text-emerald-700 hover:bg-emerald-200 active:bg-emerald-300 transition-colors"
          >
            Random (set)
          </button>
        </div>

        <details class="rounded-md bg-slate-50 p-3 text-sm">
          <summary class="cursor-pointer font-medium text-slate-700">
            History (last 10)
          </summary>
          <ol class="mt-2 list-decimal pl-5 text-slate-600 space-y-0.5">
            @for (value of history(); track $index) {
              <li class="tabular-nums">{{ value }}</li>
            }
          </ol>
        </details>
      </div>
    </section>
  `,
})
export default class SignalsComponent {
  protected readonly count = signal(0);
  protected readonly history = signal<readonly number[]>([]);

  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly parity = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));

  protected incrementBy(step: number): void {
    this.count.update((current) => current + step);
    this.pushHistory();
  }

  protected decrement(): void {
    this.count.update((current) => current - 1);
    this.pushHistory();
  }

  protected reset(): void {
    this.count.set(0);
    this.pushHistory();
  }

  protected setRandom(): void {
    this.count.set(Math.floor(Math.random() * 201) - 100);
    this.pushHistory();
  }

  private pushHistory(): void {
    this.history.update((current) => {
      const next = [...current, this.count()];
      return next.length > 10 ? next.slice(next.length - 10) : next;
    });
  }
}