import { Component } from '@angular/core';

@Component({
  selector: 'app-signals',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">Signals</h1>
      <p class="text-slate-700">Angular Signals playground — reactive primitives, computed values, and effects.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. Experiments coming soon.
      </div>
    </section>
  `,
})
export default class SignalsComponent {}