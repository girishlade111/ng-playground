import { Component } from '@angular/core';

@Component({
  selector: 'app-forms',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">Forms</h1>
      <p class="text-slate-700">Reactive Forms, Template-driven Forms, and custom validators.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. Forms experiments coming soon.
      </div>
    </section>
  `,
})
export default class FormsComponent {}