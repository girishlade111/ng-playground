import { Component } from '@angular/core';

@Component({
  selector: 'app-crud',
  standalone: true,
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-indigo-600">CRUD</h1>
      <p class="text-slate-700">Create, Read, Update, Delete with HttpClient and signals.</p>
      <div class="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
        Placeholder. CRUD demo coming soon.
      </div>
    </section>
  `,
})
export default class CrudComponent {}