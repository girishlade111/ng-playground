import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-nav-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a
            routerLink="/"
            class="text-xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            ng-playground
          </a>

          <button
            type="button"
            (click)="toggle()"
            class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            [attr.aria-expanded]="open()"
            aria-controls="primary-nav"
            aria-label="Toggle navigation menu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              @if (open()) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              }
            </svg>
          </button>

          <ul class="hidden md:flex md:items-center md:gap-1">
            @for (item of navItems; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-indigo-50 text-indigo-700"
                  [routerLinkActiveOptions]="{ exact: false }"
                  class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </div>
      </div>

      <div
        id="primary-nav"
        [ngClass]="open() ? 'block' : 'hidden'"
        class="md:hidden border-t border-slate-200 bg-white"
      >
        <ul class="px-2 pt-2 pb-3 space-y-1">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="close()"
                class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
})
export default class NavLayoutComponent {
  protected readonly open = signal(false);

  protected readonly navItems: readonly NavItem[] = [
    { path: '/signals', label: 'Signals' },
    { path: '/forms', label: 'Forms' },
    { path: '/crud', label: 'CRUD' },
    { path: '/ssr-defer', label: 'SSR @defer' },
    { path: '/rxjs', label: 'RxJS' },
    { path: '/di', label: 'DI' },
    { path: '/router', label: 'Router' },
    { path: '/animations', label: 'Animations' },
    { path: '/zoneless', label: 'Zoneless' },
  ];

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}