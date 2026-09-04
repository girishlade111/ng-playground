import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

      <h2 class="text-2xl font-bold text-indigo-600 pt-4">
        Signals · Derived State (<code class="rounded bg-slate-100 px-1 text-base">computed()</code> + <code class="rounded bg-slate-100 px-1 text-base">effect()</code>)
      </h2>
      <p class="text-slate-700">
        Two input signals drive a <code class="rounded bg-slate-100 px-1">computed()</code>
        full name. An <code class="rounded bg-slate-100 px-1">effect()</code> appends a
        timestamped log entry whenever the derived value changes.
      </p>

      <div class="rounded-xl bg-white p-6 shadow-md space-y-5">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block text-sm">
            <span class="font-medium text-slate-700">First name</span>
            <input
              type="text"
              data-testid="first-name"
              [value]="firstName()"
              (input)="firstName.set($any($event.target).value)"
              class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ada"
            />
          </label>
          <label class="block text-sm">
            <span class="font-medium text-slate-700">Last name</span>
            <input
              type="text"
              data-testid="last-name"
              [value]="lastName()"
              (input)="lastName.set($any($event.target).value)"
              class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Lovelace"
            />
          </label>
        </div>

        <div class="rounded-md bg-slate-50 px-3 py-2">
          <div class="text-sm text-slate-500">Full name (computed)</div>
          <div
            data-testid="full-name"
            class="font-semibold text-slate-800 text-lg tabular-nums"
          >
            {{ fullName() }}
          </div>
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <div class="text-sm font-medium text-slate-700">
              Effect log (timestamped)
            </div>
            <button
              type="button"
              (click)="clearLog()"
              class="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 active:bg-slate-400 transition-colors"
            >
              Clear log
            </button>
          </div>
          <div
            data-testid="effect-log"
            class="max-h-56 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-700 space-y-1"
          >
            @if (log().length === 0) {
              <div class="text-slate-400 italic px-1">No entries yet — edit a field above.</div>
            } @else {
              @for (entry of log(); track $index) {
                <div class="flex gap-3">
                  <span class="shrink-0 text-slate-400 tabular-nums">{{ entry.timestamp }}</span>
                  <span class="shrink-0 text-slate-500">fullName</span>
                  <span class="text-slate-800">→ {{ entry.value }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>

<h2 class="text-2xl font-bold text-indigo-600 pt-4">
        Signals · <code class="rounded bg-slate-100 px-1 text-base">linkedSignal()</code> Pattern & Signal Forms
      </h2>
      <p class="text-slate-700">
        <code class="rounded bg-slate-100 px-1">linkedSignal()</code> (Angular 19+) keeps a
        writable signal in sync with a source. This demo shows the manual pattern using
        <code class="rounded bg-slate-100 px-1">signal()</code> +
        <code class="rounded bg-slate-100 px-1">effect()</code>: the shipping
        selection resets to a valid default whenever the country changes. Below that, a
        plain signal is bound directly to an
        <code class="rounded bg-slate-100 px-1"><input></code> with no
        <code class="rounded bg-slate-100 px-1">FormsModule</code>.
      </p>

      <div class="rounded-xl bg-white p-6 shadow-md space-y-5">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block text-sm">
            <span class="font-medium text-slate-700">Country</span>
            <select
              data-testid="country"
              [value]="country()"
              (change)="country.set($any($event.target).value)"
              class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              @for (c of countries; track c.code) {
                <option [value]="c.code">{{ c.name }}</option>
              }
            </select>
          </label>
          <label class="block text-sm">
            <span class="font-medium text-slate-700">Shipping option</span>
            <select
              data-testid="shipping"
              [value]="shipping()"
              (change)="shipping.set($any($event.target).value)"
              class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              @for (opt of availableShipping(); track opt.id) {
                <option [value]="opt.id">{{ opt.label }}</option>
              }
            </select>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-md bg-slate-50 px-3 py-2">
            <div class="text-slate-500">Country (source)</div>
            <div class="font-semibold text-slate-800" data-testid="country-display">{{ countryLabel() }}</div>
          </div>
          <div class="rounded-md bg-slate-50 px-3 py-2">
            <div class="text-slate-500">Shipping (linked)</div>
            <div class="font-semibold text-slate-800" data-testid="shipping-display">{{ shippingLabel() }}</div>
          </div>
        </div>

        <div class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Change the country — the shipping selection automatically resets to the first
          valid option for the new country. This is the <code class="rounded bg-amber-100 px-1">signal() + effect()</code> pattern
          (<code class="rounded bg-slate-100 px-1">linkedSignal()</code> in Angular 19+).
        </div>

        <hr class="border-slate-200" />

        <div class="space-y-3">
          <label class="block text-sm">
            <span class="font-medium text-slate-700">Display name (signal-bound input)</span>
            <input
              type="text"
              data-testid="display-name"
              [value]="displayName()"
              (input)="displayName.set($any($event.target).value)"
              class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Type here…"
            />
          </label>
          <div class="rounded-md bg-slate-50 px-3 py-2">
            <div class="text-sm text-slate-500">Live preview (signal value)</div>
            <div
              data-testid="display-name-preview"
              class="font-semibold text-slate-800 text-lg tabular-nums"
            >
              {{ displayName() || '(empty)' }}
            </div>
          </div>
          <div class="text-xs text-slate-500">
            Length: <span data-testid="display-name-length" class="font-mono text-slate-700">{{ displayName().length }}</span>
            · Uppercased: <span data-testid="display-name-upper" class="font-mono text-slate-700">{{ displayName().toUpperCase() }}</span>
          </div>
        </div>
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

  protected readonly firstName = signal('Ada');
  protected readonly lastName = signal('Lovelace');

  protected readonly fullName = computed(
    () => `${this.firstName()} ${this.lastName()}`.trim(),
  );

  protected readonly log = signal<readonly { timestamp: string; value: string }[]>(
    [],
  );

  protected readonly countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
  ] as const;

  protected readonly country = signal('US');

  protected readonly availableShipping = computed(() =>
    this.country() === 'US'
      ? [
          { id: 'us-standard', label: 'Standard (3–5 days)' },
          { id: 'us-express', label: 'Express (1–2 days)' },
          { id: 'us-overnight', label: 'Overnight' },
        ]
      : this.country() === 'CA'
        ? [
            { id: 'ca-standard', label: 'Standard (5–7 days)' },
            { id: 'ca-express', label: 'Express (2–3 days)' },
          ]
        : [
            { id: 'mx-standard', label: 'Estándar (4–6 días)' },
            { id: 'mx-express', label: 'Exprés (1–2 días)' },
          ],
  );

  protected readonly shipping = signal('');

  protected readonly countryLabel = computed(() =>
    this.countries.find((c) => c.code === this.country())?.name ?? '',
  );

  protected readonly shippingLabel = computed(() =>
    this.availableShipping().find((o) => o.id === this.shipping())?.label ?? '',
  );

  protected readonly displayName = signal('');

  constructor() {
    const platformId = inject(PLATFORM_ID);
    // linkedSignal pattern (manual in Angular 18): reset shipping when country changes
    effect(() => {
      if (!isPlatformBrowser(platformId)) return;
      const options = this.availableShipping();
      this.shipping.set(options[0]?.id ?? '');
    });

    // fullName effect for log
    let firstRun = true;
    effect(() => {
      if (!isPlatformBrowser(platformId)) return;
      const value = this.fullName();
      if (firstRun) {
        firstRun = false;
        return;
      }
      this.log.update((current) => [
        ...current,
        { timestamp: new Date().toISOString().slice(11, 23), value },
      ]);
    });
  }

  protected clearLog(): void {
    this.log.set([]);
  }
}