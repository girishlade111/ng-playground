import { Component } from '@angular/core';
import { HeavyViewportComponent } from './heavy-viewport.component';
import { HeavyIdleComponent } from './heavy-idle.component';
import { HeavyTimerComponent } from './heavy-timer.component';

@Component({
  selector: 'app-ssr-defer',
  standalone: true,
  imports: [HeavyViewportComponent, HeavyIdleComponent, HeavyTimerComponent],
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">SSR &#64;defer</h1>
      <p class="text-slate-700">Deferrable views with &#64;defer, &#64;loading, &#64;placeholder for SSR-friendly code splitting.</p>

      <div class="space-y-12">
        <!-- Viewport Trigger -->
        <section class="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
          <h2 class="text-xl font-semibold text-slate-800">Trigger: on viewport</h2>
          <p class="text-slate-600">Scroll down to trigger lazy loading. Component loads when it enters the viewport.</p>
          <div class="h-64 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            Scroll down...
          </div>

          @defer (on viewport; when retryViewport) {
            <app-heavy-viewport />
          } @placeholder {
            <div class="rounded-lg border-2 border-dashed border-indigo-300 p-6 bg-indigo-50 text-center">
              <div class="text-indigo-600 font-medium">Placeholder: Waiting for viewport...</div>
              <div class="text-sm text-indigo-400 mt-1">Scroll this section into view</div>
            </div>
          } @loading (minimum 500ms) {
            <div class="rounded-lg border-2 border-solid border-indigo-400 p-6 bg-indigo-50 text-center animate-pulse">
              <div class="text-indigo-600 font-medium">Loading viewport component...</div>
              <div class="text-sm text-indigo-400 mt-1">Fetching lazy chunk</div>
            </div>
          } @error {
            <div class="rounded-lg border-2 border-solid border-red-400 p-6 bg-red-50 text-center">
              <div class="text-red-600 font-medium">Error loading viewport component</div>
              <button class="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700" (click)="retryViewport = !retryViewport">
                Retry
              </button>
            </div>
          }

          <div class="h-64 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            (Scroll past this to trigger viewport)
          </div>
        </section>

        <!-- Idle Trigger -->
        <section class="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
          <h2 class="text-xl font-semibold text-slate-800">Trigger: on idle</h2>
          <p class="text-slate-600">Loads when the browser is idle (requestIdleCallback). No scroll needed.</p>

          @defer (on idle; when retryIdle) {
            <app-heavy-idle />
          } @placeholder {
            <div class="rounded-lg border-2 border-dashed border-emerald-300 p-6 bg-emerald-50 text-center">
              <div class="text-emerald-600 font-medium">Placeholder: Waiting for browser idle...</div>
              <div class="text-sm text-emerald-400 mt-1">Loads when main thread is free</div>
            </div>
          } @loading (minimum 500ms) {
            <div class="rounded-lg border-2 border-solid border-emerald-400 p-6 bg-emerald-50 text-center animate-pulse">
              <div class="text-emerald-600 font-medium">Loading idle component...</div>
              <div class="text-sm text-emerald-400 mt-1">Browser idle callback fired</div>
            </div>
          } @error {
            <div class="rounded-lg border-2 border-solid border-red-400 p-6 bg-red-50 text-center">
              <div class="text-red-600 font-medium">Error loading idle component</div>
              <button class="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700" (click)="retryIdle = !retryIdle">
                Retry
              </button>
            </div>
          }
        </section>

        <!-- Timer Trigger -->
        <section class="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
          <h2 class="text-xl font-semibold text-slate-800">Trigger: on timer(3s)</h2>
          <p class="text-slate-600">Loads automatically after 3 seconds regardless of scroll or idle state.</p>

          @defer (on timer(3s); when retryTimer) {
            <app-heavy-timer />
          } @placeholder {
            <div class="rounded-lg border-2 border-dashed border-amber-300 p-6 bg-amber-50 text-center">
              <div class="text-amber-600 font-medium">Placeholder: Waiting for timer (3s)...</div>
              <div class="text-sm text-amber-400 mt-1">Auto-loads after 3 seconds</div>
            </div>
          } @loading (minimum 500ms) {
            <div class="rounded-lg border-2 border-solid border-amber-400 p-6 bg-amber-50 text-center animate-pulse">
              <div class="text-amber-600 font-medium">Loading timer component...</div>
              <div class="text-sm text-amber-400 mt-1">Timer elapsed, fetching chunk</div>
            </div>
          } @error {
            <div class="rounded-lg border-2 border-solid border-red-400 p-6 bg-red-50 text-center">
              <div class="text-red-600 font-medium">Error loading timer component</div>
              <button class="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700" (click)="retryTimer = !retryTimer">
                Retry
              </button>
            </div>
          }
        </section>
      </div>
    </section>
  `,
})
export default class SsrDeferComponent {
  retryViewport = false;
  retryIdle = false;
  retryTimer = false;
}