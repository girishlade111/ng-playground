import {
  Component,
  inject,
  afterNextRender,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { CommonModule } from '@angular/common';

const DATA_KEY = makeStateKey<{ message: string; timestamp: string }>('ssr-data');

@Component({
  selector: 'app-ssr-hydration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6 max-w-2xl mx-auto p-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-indigo-600">SSR + Hydration Verification</h1>
        <p class="text-slate-700">
          Demonstrates server-side rendering with TransferState and hydration detection.
        </p>
      </header>

      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Server Data:</label>
          <p class="font-mono text-lg text-slate-900">{{ data()?.message }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Rendered at:</label>
          <p class="font-mono text-lg text-slate-900">{{ data()?.timestamp }}</p>
        </div>

        <div class="pt-4 border-t border-slate-200">
          <label class="text-sm font-medium text-slate-700">Hydration Status:</label>
          <div class="mt-2 flex items-center gap-3">
            <span
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              [class]="hydrationClass()"
            >
              <span class="relative flex h-2 w-2" [class]="pulseClass()">
                <span
                  class="absolute inset-0 rounded-full bg-current opacity-75 animate-ping"
                ></span>
                <span class="relative block rounded-full bg-current"></span>
              </span>
              {{ hydrationText() }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p class="font-medium">Verification Checklist:</p>
        <ul class="mt-2 space-y-1 list-disc list-inside">
          <li>View Source (Ctrl+U) shows server-rendered content (not empty shell)</li>
          <li>Hydration badge changes from "Server-Rendered" (amber) to "Hydrated" (emerald)</li>
          <li>Network tab: No duplicate API call on client after SSR</li>
        </ul>
      </div>
    </section>
  `,
  styles: ``,
})
export default class SsrHydrationComponent {
  private transferState = inject(TransferState);

  data = this.transferState.get(DATA_KEY, null);

  hydrationText = signal('Server-Rendered');
  hydrationClass = signal('bg-amber-100 text-amber-800');
  pulseClass = signal('bg-amber-500');

  constructor() {
    if (this.data === null) {
      const timestamp = new Date().toISOString();
      const payload = {
        message: 'Data fetched during SSR on the server',
        timestamp,
      };
      this.transferState.set(DATA_KEY, payload);
      this.data = signal(payload);
    }

    afterNextRender(() => {
      this.hydrationText.set('Hydrated');
      this.hydrationClass.set('bg-emerald-100 text-emerald-800');
      this.pulseClass.set('bg-emerald-500');
    });
  }
}