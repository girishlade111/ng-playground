import { Component, InjectionToken, inject, input } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  version: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: (): AppConfig => ({
    apiUrl: 'https://api.default.example.com',
    version: '1.0.0',
  }),
});

@Component({
  selector: 'app-config-display',
  standalone: true,
  template: `
    <div class="p-4 rounded-lg border-2" [class.border-indigo-500]="isParent()" [class.border-emerald-500]="isChild()" [class.border-amber-500]="isRoot()">
      <h3 class="font-semibold text-lg mb-2">{{ label() }}</h3>
      <div class="space-y-1 text-sm font-mono">
        <div><span class="font-medium">Theme:</span> {{ config.theme }}</div>
        <div><span class="font-medium">API URL:</span> {{ config.apiUrl }}</div>
        <div><span class="font-medium">Version:</span> {{ config.version }}</div>
      </div>
    </div>
  `,
})
class ConfigDisplayComponent {
  label = input.required<string>();
  config = inject(APP_CONFIG);

  isParent = () => this.label().includes('Parent');
  isChild = () => this.label().includes('Child');
  isRoot = () => this.label().includes('Root');
}

@Component({
  selector: 'app-child-config',
  standalone: true,
  imports: [ConfigDisplayComponent],
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.child.example.com', version: '3.0.0-beta' } },
  ],
  template: `
    <app-config-display [label]="'Child Component (Override)'"></app-config-display>
  `,
})
class ChildConfigComponent {}

@Component({
  selector: 'app-parent-config',
  standalone: true,
  imports: [ConfigDisplayComponent, ChildConfigComponent],
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.parent.example.com', version: '2.0.0' } },
  ],
  template: `
    <div class="space-y-4">
      <app-config-display [label]="'Parent Component (Override)'"></app-config-display>
      <app-child-config></app-child-config>
    </div>
  `,
})
class ParentConfigComponent {}

@Component({
  selector: 'app-di-root-display',
  standalone: true,
  imports: [ConfigDisplayComponent],
  template: `
    <app-config-display [label]="'Root Injector (Default)'"></app-config-display>
  `,
})
class RootConfigDisplayComponent {}

@Component({
  selector: 'app-di',
  standalone: true,
  imports: [ParentConfigComponent, RootConfigDisplayComponent, ChildConfigComponent],
  template: `
    <section class="space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">Custom InjectionToken + Hierarchical Providers</h1>
        <p class="text-slate-700 mt-1">Demonstrates DI hierarchy resolution: root &rarr; parent &rarr; child injector override.</p>
      </header>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-slate-800">Root Level</h2>
          <p class="text-sm text-slate-600">Default config via <code>providedIn: 'root'</code></p>
          <app-di-root-display></app-di-root-display>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-slate-800">Parent Component</h2>
          <p class="text-sm text-slate-600">Provides its own <code>APP_CONFIG</code> value</p>
          <app-parent-config></app-parent-config>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-slate-800">Child Component</h2>
          <p class="text-sm text-slate-600">Overrides parent's <code>APP_CONFIG</code> value</p>
          <app-child-config></app-child-config>
        </div>
      </div>

      <div class="rounded-lg bg-slate-50 p-6 border border-slate-200">
        <h3 class="font-semibold text-slate-800 mb-3">How it works</h3>
        <ol class="space-y-2 text-slate-700 list-decimal list-inside">
          <li><code>APP_CONFIG</code> token defined with <code>providedIn: 'root'</code> and factory for defaults</li>
          <li>Parent component adds provider to override <code>APP_CONFIG</code> &mdash; creates new injector level</li>
          <li>Child component adds its own provider &mdash; creates another injector level</li>
          <li>Each <code>ConfigDisplayComponent</code> injects <code>APP_CONFIG</code> &mdash; resolves to nearest provider in hierarchy</li>
        </ol>
      </div>
    </section>
  `,
})
export default class DiComponent {}