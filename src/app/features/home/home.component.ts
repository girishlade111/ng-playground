import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FeatureCard {
  readonly path: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-10">
      <header class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400">ng-playground</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Angular 18+ standalone playground showcasing modern Angular capabilities.
          Explore signals, forms, SSR, RxJS, and more through interactive examples.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (feature of features; track feature.path) {
          <article class="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col h-full">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
              <span class="text-2xl" [innerHTML]="feature.icon"></span>
            </div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">{{ feature.label }}</h2>
            <p class="text-slate-600 dark:text-slate-400 text-sm flex-1 mb-4">{{ feature.description }}</p>
            <a
              [routerLink]="feature.path"
              class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 gap-1"
            >
              Explore
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </article>
        }
      </div>
    </section>
  `,
})
export default class HomeComponent {
  protected readonly features: readonly FeatureCard[] = [
    {
      path: '/signals',
      label: 'Signals',
      description: 'Reactive state management with fine-grained reactivity and computed values.',
      icon: '⚡',
    },
    {
      path: '/forms',
      label: 'Forms',
      description: 'Template-driven and reactive forms with validation and dynamic fields.',
      icon: '📝',
    },
    {
      path: '/crud',
      label: 'CRUD',
      description: 'Full-stack data operations with optimistic updates and error handling.',
      icon: '🗄️',
    },
    {
      path: '/ssr-defer',
      label: 'SSR @defer',
      description: 'Incremental hydration and deferred loading for optimal performance.',
      icon: '⚙️',
    },
    {
      path: '/rxjs',
      label: 'RxJS',
      description: 'Reactive streams, operators, and advanced observable patterns.',
      icon: '🌊',
    },
    {
      path: '/di',
      label: 'Dependency Injection',
      description: 'Hierarchical injectors, tokens, and modern DI patterns.',
      icon: '🔧',
    },
    {
      path: '/router',
      label: 'Router',
      description: 'Guards, lazy loading, protected routes, and navigation patterns.',
      icon: '🛣️',
    },
    {
      path: '/animations',
      label: 'Animations',
      description: 'Complex animations with triggers, transitions, and keyframes.',
      icon: '✨',
    },
    {
      path: '/zoneless',
      label: 'Zoneless',
      description: 'Zone.js-free change detection with signal-based reactivity.',
      icon: '🎯',
    },
  ] as const;
}