import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6">
      <h1 class="text-4xl font-bold text-indigo-600">ng-playground</h1>
      <p class="text-slate-700 text-lg">
        Angular 18 standalone playground. Pick a feature from the nav above.
      </p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        @for (link of quickLinks; track link.path) {
          <a
            [routerLink]="link.path"
            class="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            {{ link.label }}
          </a>
        }
      </div>
    </section>
  `,
})
export default class HomeComponent {
  protected readonly quickLinks = [
    { path: '/signals', label: 'Signals' },
    { path: '/forms', label: 'Forms' },
    { path: '/crud', label: 'CRUD' },
    { path: '/ssr-defer', label: 'SSR @defer' },
    { path: '/rxjs', label: 'RxJS' },
    { path: '/di', label: 'DI' },
    { path: '/router', label: 'Router' },
    { path: '/animations', label: 'Animations' },
  ] as const;
}