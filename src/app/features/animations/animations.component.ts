import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  group,
} from '@angular/animations';
import { Task } from '../../shared/services/task.model';

@Component({
  selector: 'app-animations',
  standalone: true,
  template: `
    <section class="space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">Animations</h1>
        <p class="text-slate-700">CSS transitions, Angular Animations API, and view transitions.</p>
      </header>

      <!-- Demo 1: Route Transition (Tab Switch) -->
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Route Transition (Tab Switch)</h2>
        <p class="text-slate-600 mb-4">Fade + slide transition between two tab views using <code>&#64;angular/animations</code>.</p>

        <div class="flex gap-2 mb-4 border-b border-slate-200">
          <button
            (click)="activeTab = 'tab1'"
            [class.bg-indigo-600]="activeTab === 'tab1'"
            [class.text-white]="activeTab === 'tab1'"
            class="px-4 py-2 rounded-t-lg font-medium transition-colors hover:bg-indigo-50"
          >
            Tab 1
          </button>
          <button
            (click)="activeTab = 'tab2'"
            [class.bg-indigo-600]="activeTab === 'tab2'"
            [class.text-white]="activeTab === 'tab2'"
            class="px-4 py-2 rounded-t-lg font-medium transition-colors hover:bg-indigo-50"
          >
            Tab 2
          </button>
        </div>

        <div class="relative min-h-[200px]" [@tabSwitch]="activeTab">
          @if (activeTab === 'tab1') {
            <div class="absolute inset-0">
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900">Tab 1 Content</h3>
                <p class="text-slate-600">This is the first tab panel. Click the tabs above to see the fade/slide transition.</p>
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="rounded-lg border border-slate-200 p-4 bg-slate-50">
                    <h4 class="font-medium text-slate-900">Card A</h4>
                    <p class="text-sm text-slate-600 mt-1">Content for the first tab panel.</p>
                  </div>
                  <div class="rounded-lg border border-slate-200 p-4 bg-slate-50">
                    <h4 class="font-medium text-slate-900">Card B</h4>
                    <p class="text-sm text-slate-600 mt-1">More content in the first tab.</p>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeTab === 'tab2') {
            <div class="absolute inset-0">
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900">Tab 2 Content</h3>
                <p class="text-slate-600">This is the second tab panel. Notice the smooth transition when switching.</p>
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="rounded-lg border border-slate-200 p-4 bg-indigo-50">
                    <h4 class="font-medium text-slate-900">Card X</h4>
                    <p class="text-sm text-slate-600 mt-1">Content for the second tab panel.</p>
                  </div>
                  <div class="rounded-lg border border-slate-200 p-4 bg-indigo-50">
                    <h4 class="font-medium text-slate-900">Card Y</h4>
                    <p class="text-sm text-slate-600 mt-1">More content in the second tab.</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Demo 2: Staggered List Animation -->
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Staggered List Animation</h2>
            <p class="text-slate-600">Items fade/slide in sequentially with 80ms delay increment.</p>
          </div>
          <div class="flex gap-2">
            <button
              (click)="populateList()"
              [disabled]="tasks.length > 0"
              class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Populate List
            </button>
            <button
              (click)="clearList()"
              [disabled]="tasks.length === 0"
              class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear List
            </button>
          </div>
        </div>

        <div class="min-h-[300px]" [@listStagger]="tasks.length">
          <ul class="space-y-3" *ngIf="tasks.length > 0">
            <li *ngFor="let task of tasks" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
              <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                [class.bg-green-500]="task.status === 'done'"
                [class.bg-amber-500]="task.status === 'in-progress'"
                [class.bg-slate-400]="task.status === 'todo'"
              >
                {{ task.status === 'done' ? '✓' : task.status === 'in-progress' ? '→' : '○' }}
              </span>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-slate-900 truncate">{{ task.title }}</h4>
                <p class="text-sm text-slate-500 truncate">{{ task.description }}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                {{ task.status }}
              </span>
            </li>
          </ul>
          <div *ngIf="tasks.length === 0" class="text-center py-12 text-slate-500">
            <p>Click "Populate List" to see the staggered animation.</p>
          </div>
        </div>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    // Route Transition Animation
    trigger('tabSwitch', [
      transition('tab1 <=> tab2', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%', opacity: 0 }), { optional: true }),
        query(':leave', [
          animate('200ms ease-out', style({ opacity: 0, transform: 'translateX(-20px)' }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(20px)' }),
          animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true }),
      ]),
    ]),

    // Staggered List Animation
    trigger('listStagger', [
      transition('0 => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('80ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
      ]),
      transition('* => 0', [
        query(':leave', [
          stagger('50ms', [
            animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
          ])
        ], { optional: true }),
      ]),
    ]),
  ],
})
export default class AnimationsComponent {
  activeTab = 'tab1';
  tasks: Task[] = [];

  private readonly sampleTasks: Task[] = [
    { id: '1', title: 'Design system setup', description: 'Create design tokens and base components', status: 'done', createdAt: new Date('2024-01-15') },
    { id: '2', title: 'Authentication flow', description: 'Implement login, register, and password reset', status: 'done', createdAt: new Date('2024-01-20') },
    { id: '3', title: 'API integration', description: 'Connect frontend to backend services', status: 'in-progress', createdAt: new Date('2024-01-25') },
    { id: '4', title: 'Unit test coverage', description: 'Achieve 80%+ coverage for critical paths', status: 'todo', createdAt: new Date('2024-02-01') },
    { id: '5', title: 'Documentation', description: 'Write API docs and user guides', status: 'todo', createdAt: new Date('2024-02-05') },
    { id: '6', title: 'Performance audit', description: 'Optimize bundle size and runtime performance', status: 'todo', createdAt: new Date('2024-02-10') },
    { id: '7', title: 'Accessibility review', description: 'WCAG 2.2 AA compliance check', status: 'todo', createdAt: new Date('2024-02-15') },
    { id: '8', title: 'Deploy to production', description: 'Configure CI/CD and release pipeline', status: 'in-progress', createdAt: new Date('2024-02-20') },
  ];

  populateList(): void {
    this.tasks = [...this.sampleTasks];
  }

  clearList(): void {
    this.tasks = [];
  }
}