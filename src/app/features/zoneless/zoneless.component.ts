import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-zoneless',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-8 max-w-4xl">
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-indigo-600">Zoneless Change Detection</h1>
        <p class="text-slate-700 text-lg">
          This page demonstrates Angular's experimental zoneless change detection,
          bootstrapped with <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">provideExperimentalZonelessChangeDetection()</code>.
        </p>
      </header>

      <!-- Counter Demo -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-6">
        <h2 class="text-2xl font-bold text-indigo-600">Signal-Driven Counter (No zone.js)</h2>
        <p class="text-slate-700">
          This counter uses <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">signal()</code>,
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">computed()</code>, and
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">effect()</code>
          — all working without <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">zone.js</code> patching.
        </p>

        <div class="space-y-5">
          <div class="text-center">
            <div class="text-sm uppercase tracking-wide text-slate-500">Current Value</div>
            <div
              data-testid="zoneless-count"
              class="mt-2 text-7xl font-extrabold tabular-nums"
              [class.text-indigo-600]="count() > 0"
              [class.text-rose-600]="count() < 0"
              [class.text-slate-700]="count() === 0"
            >
              {{ count() }}
            </div>
            <div class="mt-2 text-sm text-slate-500">
              Doubled: <span class="font-semibold" data-testid="zoneless-doubled">{{ doubled() }}</span>
              · Parity: <span class="font-semibold" data-testid="zoneless-parity">{{ parity() }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              (click)="decrement()"
              class="rounded-lg bg-rose-100 px-5 py-2.5 font-medium text-rose-700 hover:bg-rose-200 active:bg-rose-300 transition-colors"
            >
              − Decrement
            </button>
            <button
              type="button"
              (click)="incrementBy(1)"
              class="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
            >
              + Increment
            </button>
            <button
              type="button"
              (click)="incrementBy(5)"
              class="rounded-lg bg-indigo-100 px-5 py-2.5 font-medium text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300 transition-colors"
            >
              +5
            </button>
            <button
              type="button"
              (click)="reset()"
              class="rounded-lg bg-slate-200 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-300 active:bg-slate-400 transition-colors"
            >
              Reset (set 0)
            </button>
            <button
              type="button"
              (click)="setRandom()"
              class="rounded-lg bg-emerald-100 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-200 active:bg-emerald-300 transition-colors"
            >
              Random
            </button>
          </div>

          <!-- Async update demo -->
          <div class="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div class="font-medium text-amber-800 mb-2">Async Update Test (setTimeout)</div>
            <button
              type="button"
              (click)="asyncIncrement()"
              class="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 transition-colors"
            >
              Increment via setTimeout (100ms)
            </button>
            <div class="mt-2 text-sm text-amber-700" data-testid="async-status">
              {{ asyncStatus() }}
            </div>
          </div>

          <details class="rounded-lg bg-slate-50 p-4 text-sm">
            <summary class="cursor-pointer font-medium text-slate-700">
              History (last 10)
            </summary>
            <ol class="mt-3 list-decimal pl-6 text-slate-600 space-y-1">
              @for (value of history(); track $index) {
                <li class="tabular-nums">{{ value }}</li>
              }
            </ol>
          </details>
        </div>
      </div>

      <!-- Effect log -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-4">
        <h2 class="text-2xl font-bold text-indigo-600">Effect Log (Auto-tracking)</h2>
        <p class="text-slate-700">
          An <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">effect()</code> logs every counter change.
          In zoneless mode, effects still track signal dependencies correctly.
        </p>

        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-slate-700">Effect Log</div>
          <button
            type="button"
            (click)="clearEffectLog()"
            class="rounded bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Clear
          </button>
        </div>

        <div
          data-testid="zoneless-effect-log"
          class="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-700 space-y-1"
        >
          @if (effectLog().length === 0) {
            <div class="text-slate-400 italic px-1">No entries — interact with the counter above.</div>
          } @else {
            @for (entry of effectLog(); track $index) {
              <div class="flex gap-3">
                <span class="shrink-0 text-slate-400 tabular-nums">{{ entry.timestamp }}</span>
                <span class="shrink-0 text-slate-500">count</span>
                <span class="text-slate-800">→ {{ entry.value }}</span>
              </div>
            }
          }
        </div>
      </div>

      <!-- Explanation Section -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-6">
        <h2 class="text-2xl font-bold text-indigo-600">What Zoneless Mode Changes</h2>

        <div class="space-y-4 text-slate-700 leading-relaxed">
          <div class="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-4">
            <h3 class="font-semibold text-indigo-800 mb-2">No zone.js Required</h3>
            <p>
              The <code class="rounded bg-indigo-100 px-1.5 py-0.5 text-sm font-mono">zone.js</code> library (~30KB minzipped) is no longer loaded.
              Angular's signals system directly notifies the framework when state changes,
              eliminating the need for zone.js's monkey-patching of browser APIs
              (<code class="rounded bg-indigo-100 px-1.5 py-0.5 text-sm font-mono">setTimeout</code>,
              <code class="rounded bg-indigo-100 px-1.5 py-0.5 text-sm font-mono">Promise</code>,
              <code class="rounded bg-indigo-100 px-1.5 py-0.5 text-sm font-mono">addEventListener</code>, etc.).
            </p>
          </div>

          <div class="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
            <h3 class="font-semibold text-emerald-800 mb-2">Bundle Size Reduction</h3>
            <p>
              Removing <code class="rounded bg-emerald-100 px-1.5 py-0.5 text-sm font-mono">zone.js</code> reduces the initial bundle by ~30KB.
              For apps using signals + <code class="rounded bg-emerald-100 px-1.5 py-0.5 text-sm font-mono">OnPush</code> everywhere,
              this is pure savings with no runtime cost.
            </p>
          </div>

          <div class="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
            <h3 class="font-semibold text-amber-800 mb-2">Performance: No Zone Overhead</h3>
            <p>
              zone.js wraps every async task to trigger change detection. Zoneless removes this overhead entirely.
              Change detection runs only when signals actually change — no more global zone checks on every
              <code class="rounded bg-amber-100 px-1.5 py-0.5 text-sm font-mono">setTimeout</code>, <code class="rounded bg-amber-100 px-1.5 py-0.5 text-sm font-mono">Promise</code> resolution, or DOM event.
            </p>
          </div>

          <div class="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-4">
            <h3 class="font-semibold text-rose-800 mb-2">Developer Experience Changes</h3>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>No more <code class="rounded bg-rose-100 px-1.5 py-0.5 text-sm font-mono">NgZone.run()</code> / <code class="rounded bg-rose-100 px-1.5 py-0.5 text-sm font-mono">runOutsideAngular()</code>:</strong>
                Signals work everywhere. Async callbacks update UI automatically.
              </li>
              <li>
                <strong>No <code class="rounded bg-rose-100 px-1.5 py-0.5 text-sm font-mono">ChangeDetectorRef.detectChanges()</code>:</strong>
                Signal mutations trigger updates directly.
              </li>
              <li>
                <strong>Third-party libs work out of the box:</strong>
                Libraries that don't trigger zone.js (e.g., some WebSocket libs, canvas animations)
                now update UI correctly when using signals.
              </li>
              <li>
                <strong><code class="rounded bg-rose-100 px-1.5 py-0.5 text-sm font-mono">OnPush</code> becomes the default mental model:</strong>
                Components only re-render when their signal inputs change.
              </li>
            </ul>
          </div>

          <div class="rounded-lg border-l-4 border-violet-500 bg-violet-50 p-4">
            <h3 class="font-semibold text-violet-800 mb-2">Migration Path</h3>
            <ol class="list-decimal pl-5 space-y-2 mt-2 text-sm">
              <li>Enable <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">provideExperimentalZonelessChangeDetection()</code> in <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">app.config.ts</code></li>
              <li>Migrate components to <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">signal()</code> / <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">computed()</code> / <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">effect()</code></li>
              <li>Use <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">ChangeDetectionStrategy.OnPush</code> everywhere</li>
              <li>Remove <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">zone.js</code> from <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">polyfills.ts</code> (or <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">angular.json</code>)</li>
              <li>Delete any <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">NgZone</code> / <code class="rounded bg-violet-100 px-1.5 py-0.5 text-sm font-mono">ChangeDetectorRef</code> usage</li>
            </ol>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 class="font-semibold text-slate-800 mb-2">Current App Configuration</h3>
          <pre class="text-sm font-mono text-slate-700 overflow-x-auto"><code>{{ appConfigCode }}</code></pre>
        </div>
      </div>

      <!-- Signal Input Demo -->
      <div class="rounded-xl bg-white p-6 shadow-md space-y-6">
        <h2 class="text-2xl font-bold text-indigo-600">Signal Inputs (Angular 17.1+)</h2>
        <p class="text-slate-700">
          Zoneless works seamlessly with <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">input()</code> signals.
          Parent updates propagate directly without zone.js.
        </p>

        <div class="space-y-4">
          <label class="block text-sm">
            <span class="font-medium text-slate-700">Parent counter value</span>
            <input
              type="number"
              [value]="parentValue()"
              (input)="parentValue.set($any($event.target).valueAsNumber)"
              class="mt-1 w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </label>

          <div class="rounded-lg bg-indigo-50 p-4">
            <div class="text-sm text-indigo-700">Child received (via signal input):</div>
            <div class="text-3xl font-bold text-indigo-600 tabular-nums mt-1" data-testid="child-signal-input">
              {{ childReceived() }}
            </div>
            <div class="text-sm text-indigo-700 mt-1">Doubled in child: {{ childDoubled() }}</div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class ZonelessComponent {
  protected readonly count = signal(0);
  protected readonly history = signal<readonly number[]>([]);
  protected readonly effectLog = signal<readonly { timestamp: string; value: number }[]>([]);
  protected readonly asyncStatus = signal('');
  protected readonly parentValue = signal(0);

  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly parity = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));

  // Signal input pattern (child receives from parent)
  protected readonly childReceived = computed(() => this.parentValue());
  protected readonly childDoubled = computed(() => this.parentValue() * 2);

  private pushHistory(): void {
    this.history.update((current) => {
      const next = [...current, this.count()];
      return next.length > 10 ? next.slice(next.length - 10) : next;
    });
  }

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

  protected asyncIncrement(): void {
    this.asyncStatus.set('Pending...');
    setTimeout(() => {
      this.count.update((c) => c + 1);
      this.pushHistory();
      this.asyncStatus.set('Updated via setTimeout ✓');
    }, 100);
  }

  protected clearEffectLog(): void {
    this.effectLog.set([]);
  }

  protected readonly appConfigCode = `import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
  ],
};`;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    effect(
      () => {
        if (!isPlatformBrowser(platformId)) return;
        const value = this.count();
        this.effectLog.update((current) => [
          ...current,
          { timestamp: new Date().toISOString().slice(11, 23), value },
        ]);
      },
      { allowSignalWrites: true },
    );
  }
}