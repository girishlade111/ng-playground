import { Component } from '@angular/core';

@Component({
  selector: 'app-ssr-defer',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">SSR &#64;defer</h1>
      <p class="text-slate-700">Deferrable views with &#64;defer, &#64;loading, &#64;placeholder for SSR-friendly code splitting.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. Defer experiments coming soon.
      </div>
    </section>
  `,
})
export default class SsrDeferComponent {}