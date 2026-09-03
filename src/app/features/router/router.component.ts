import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccessControlService } from '../../shared/services/access-control.service';

@Component({
  selector: 'app-router',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">Router Guards Demo</h1>
        <p class="text-slate-700 mt-1">
          Demonstrates <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">CanActivateFn</code>
          with a signal-based access control service.
        </p>
      </header>

      <!-- Access Toggle Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Access Control Toggle
        </h2>

        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p class="font-medium text-slate-900">Protected Route Access</p>
            <p class="text-sm text-slate-500">
              Controls access to <code class="bg-slate-100 px-1.5 py-0.5 rounded">/router/protected</code>
            </p>
          </div>

          <!-- Toggle Switch -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              [checked]="accessControl.accessGranted()"
              (change)="accessControl.toggleAccess()"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
            ></div>
          </label>
        </div>

        <!-- Status Indicator -->
        <div
          class="flex items-center gap-3 p-3 rounded-lg"
          [class.bg-green-50]="accessControl.accessGranted()"
          [class.bg-red-50]="!accessControl.accessGranted()"
        >
          <div
            class="w-3 h-3 rounded-full"
            [class.bg-green-500]="accessControl.accessGranted()"
            [class.bg-red-500]="!accessControl.accessGranted()"
          ></div>
          <span class="text-sm font-medium text-slate-700">
            Status:
            <strong
              [class.text-green-700]="accessControl.accessGranted()"
              [class.text-red-700]="!accessControl.accessGranted()"
            >
              {{ accessControl.accessGranted() ? 'GRANTED' : 'DENIED' }}
            </strong>
          </span>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Test the Guard</h2>
        <p class="text-slate-600">
          Toggle the switch above, then click the links below to test navigation:
        </p>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/router/protected"
            routerLinkActive="bg-indigo-700 text-white"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors border border-slate-300"
          >
            Navigate to Protected Route
          </a>
          <a
            routerLink="/router/denied"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            View Access Denied Page
          </a>
        </div>
      </div>

      <!-- How it works -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
        <h2 class="text-lg font-semibold text-slate-900">How It Works</h2>
        <div class="space-y-2 text-sm text-slate-600">
          <div class="flex items-start gap-2">
            <span class="text-indigo-600 font-mono text-xs mt-0.5">1.</span>
            <span>
              <strong>AccessControlService</strong> holds a <code class="bg-slate-100 px-1.5 py-0.5 rounded">signal<boolean></code>
              for access state
            </span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-indigo-600 font-mono text-xs mt-0.5">2.</span>
            <span>
              <strong>accessGuard</strong> (<code class="bg-slate-100 px-1.5 py-0.5 rounded">CanActivateFn</code>)
              injects the service and checks <code class="bg-slate-100 px-1.5 py-0.5 rounded">accessGranted()</code>
            </span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-indigo-600 font-mono text-xs mt-0.5">3.</span>
            <span>
              If <strong>true</strong>: returns <code class="bg-slate-100 px-1.5 py-0.5 rounded">true</code> (allow navigation)
            </span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-indigo-600 font-mono text-xs mt-0.5">4.</span>
            <span>
              If <strong>false</strong>: returns <code class="bg-slate-100 px-1.5 py-0.5 rounded">router.createUrlTree(['/router/denied'])</code> (redirect)
            </span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-indigo-600 font-mono text-xs mt-0.5">5.</span>
            <span>
              The <strong>toggle switch</strong> calls <code class="bg-slate-100 px-1.5 py-0.5 rounded">toggleAccess()</code>
              which updates the signal reactively
            </span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class RouterComponent {
  protected readonly accessControl = inject(AccessControlService);
}