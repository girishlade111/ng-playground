import { Component } from '@angular/core';

@Component({
  selector: 'app-animations',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">Animations</h1>
      <p class="text-slate-700">CSS transitions, Angular Animations API, and view transitions.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. Animation experiments coming soon.
      </div>
    </section>
  `,
})
export default class AnimationsComponent {}