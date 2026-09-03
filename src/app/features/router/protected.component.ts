import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6 max-w-2xl mx-auto">
      <div class="rounded-xl bg-green-50 border border-green-200 p-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-green-900">Access Granted</h1>
            <p class="text-green-700">You have successfully accessed the protected route!</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Route Guard Demo</h2>
        <p class="text-slate-600">
          This route is protected by a <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">CanActivateFn</code>
          guard that checks a signal-based access control service.
        </p>
        <ul class="space-y-2 text-sm text-slate-600 list-disc list-inside">
          <li>The guard reads from a shared <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">AccessControlService</code></li>
          <li>Access state is stored in a <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">signal</code></li>
          <li>When access is <strong>off</strong>, navigation redirects to <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">/router/denied</code></li>
          <li>When access is <strong>on</strong>, navigation proceeds normally</li>
        </ul>
        <div class="pt-4 border-t border-slate-200">
          <a
            routerLink="/router"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Router Demo
          </a>
        </div>
      </div>
    </section>
  `,
})
export default class ProtectedComponent {}