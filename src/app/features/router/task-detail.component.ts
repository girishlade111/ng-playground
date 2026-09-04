import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Task } from '../../shared/services/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">Task Detail (Resolver)</h1>
        <p class="text-slate-700 mt-1">
          Data pre-fetched by <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">ResolveFn</code>
          before component activation.
        </p>
      </header>

      <!-- Task Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">{{ task().title }}</h2>
            <p class="text-slate-600 mt-1">{{ task().description }}</p>
          </div>
          <span
            class="px-3 py-1 text-sm font-medium rounded-full"
            [class.bg-green-100]="task().status === 'done'"
            [class.text-green-800]="task().status === 'done'"
            [class.bg-blue-100]="task().status === 'in-progress'"
            [class.text-blue-800]="task().status === 'in-progress'"
            [class.bg-slate-100]="task().status === 'todo'"
            [class.text-slate-800]="task().status === 'todo'"
          >
            {{ task().status }}
          </span>
        </div>

        <div class="pt-4 border-t border-slate-200 grid gap-4 sm:grid-cols-2">
          <div>
            <p class="text-sm text-slate-500">ID</p>
            <p class="font-mono text-slate-900">{{ task().id }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-500">Created</p>
            <p class="font-medium text-slate-900">{{ task().createdAt | date : 'medium' }}</p>
          </div>
        </div>
      </div>

      <!-- Tradeoffs Note -->
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-6 space-y-4">
        <h2 class="text-lg font-semibold text-amber-900 flex items-center gap-2">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Resolver vs Component Fetch Tradeoffs
        </h2>
        <div class="space-y-3 text-sm text-amber-800">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="bg-white p-4 rounded-lg border border-amber-100">
              <h3 class="font-semibold text-amber-900 mb-2">Resolver (Route-Level)</h3>
              <ul class="space-y-1 list-disc list-inside">
                <li>No loading spinner in component</li>
                <li>Navigation waits for data</li>
                <li>Component receives ready-to-use data</li>
                <li>Cleaner component logic</li>
                <li>Better for SEO/SSR (data ready)</li>
                <li>Can share data between routes</li>
              </ul>
            </div>
            <div class="bg-white p-4 rounded-lg border border-amber-100">
              <h3 class="font-semibold text-amber-900 mb-2">Component Fetch</h3>
              <ul class="space-y-1 list-disc list-inside">
                <li>Immediate navigation feedback</li>
                <li>Component controls loading UX</li>
                <li>Can show partial content early</li>
                <li>Better perceived performance</li>
                <li>More flexible error handling</li>
                <li>Easier to implement optimistic UI</li>
              </ul>
            </div>
          </div>
          <div class="pt-2 border-t border-amber-200">
            <p class="font-medium">This demo uses a resolver:</p>
            <ul class="list-disc list-inside mt-1 space-y-1">
              <li>Navigate to <code class="bg-white px-1.5 py-0.5 rounded">/router/task/1</code> &ndash; notice the brief delay before the page appears</li>
              <li>No loading state is shown in this component</li>
              <li>The browser waits until <code class="bg-white px-1.5 py-0.5 rounded">TaskApiService.getById()</code> completes</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <a
          routerLink="/router"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Router Demo
        </a>
        <a
          routerLink="/router/task/2"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          View Task #2
        </a>
      </div>
    </section>
  `,
})
export default class TaskDetailComponent {
  readonly task = input.required<Task>();
}