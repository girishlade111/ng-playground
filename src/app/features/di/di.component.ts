import { Component } from '@angular/core';

@Component({
  selector: 'app-di',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">DI</h1>
      <p class="text-slate-700">Dependency Injection patterns, providers, inject() vs constructor, and hierarchical injectors.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. DI experiments coming soon.
      </div>
    </section>
  `,
})
export default class DiComponent {}