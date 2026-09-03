import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6 max-w-md mx-auto text-center">
      <div class="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
        <svg
          class="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Access Denied</h1>
        <p class="mt-2 text-slate-600">
          You don't have permission to access this route. Please enable access
          using the toggle on the Router demo page.
        </p>
      </div>
      <div class="flex gap-4 justify-center">
        <a
          routerLink="/router"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Router Demo
        </a>
        <a
          routerLink="/"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Home
        </a>
      </div>
    </section>
  `,
})
export default class AccessDeniedComponent {}