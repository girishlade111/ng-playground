import { Component } from '@angular/core';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">RxJS</h1>
      <p class="text-slate-700">Observables, Subjects, operators, and interop with signals (toSignal / toObservable).</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. RxJS experiments coming soon.
      </div>
    </section>
  `,
})
export default class RxjsComponent {}