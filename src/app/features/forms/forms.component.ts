import { Component, signal, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of, timer, Subject, Subscription } from 'rxjs';
import { map, delay, debounceTime, distinctUntilChanged, switchMap, catchError, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  template: `
    <section class="space-y-6 max-w-5xl mx-auto">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-indigo-600">Forms Comparison</h1>
        <p class="text-slate-700">Reactive Forms vs Template-Driven Forms — same validation, different approaches</p>
      </header>

      <!-- Tab Navigation -->
      <div class="flex border-b border-slate-200" role="tablist">
        <button
          role="tab"
          [attr.aria-selected]="activeTab() === 'reactive'"
          [class]="activeTab() === 'reactive' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
          class="px-4 py-2 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          (click)="activeTab.set('reactive')"
        >
          Reactive Forms
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeTab() === 'template'"
          [class]="activeTab() === 'template' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
          class="px-4 py-2 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          (click)="activeTab.set('template')"
        >
          Template-Driven Forms
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeTab() === 'comparison'"
          [class]="activeTab() === 'comparison' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
          class="px-4 py-2 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          (click)="activeTab.set('comparison')"
        >
          Comparison
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeTab() === 'async'"
          [class]="activeTab() === 'async' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
          class="px-4 py-2 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          (click)="activeTab.set('async')"
        >
          Async Validator
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeTab() === 'formarray'"
          [class]="activeTab() === 'formarray' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
          class="px-4 py-2 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          (click)="activeTab.set('formarray')"
        >
          Dynamic FormArray
        </button>
      </div>

      <!-- Reactive Forms Tab -->
      @if (activeTab() === 'reactive') {
        <div class="bg-white rounded-lg border border-slate-200 p-6" role="tabpanel">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Reactive Forms (FormBuilder)</h2>
          <form [formGroup]="reactiveForm" (ngSubmit)="onReactiveSubmit()" class="space-y-4" novalidate>
            <div>
              <label for="r-name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                id="r-name"
                type="text"
                formControlName="name"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="reactiveForm.get('name')?.invalid && reactiveForm.get('name')?.touched"
                [class.border-slate-300]="!(reactiveForm.get('name')?.invalid && reactiveForm.get('name')?.touched)"
                aria-describedby="r-name-error"
              />
              @if (reactiveForm.get('name')?.invalid && reactiveForm.get('name')?.touched) {
                <p id="r-name-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (reactiveForm.get('name')?.errors?.['required']) { Name is required }
                  @if (reactiveForm.get('name')?.errors?.['minlength']) { Name must be at least 2 characters }
                </p>
              }
            </div>

            <div>
              <label for="r-email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="r-email"
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="reactiveForm.get('email')?.invalid && reactiveForm.get('email')?.touched"
                [class.border-slate-300]="!(reactiveForm.get('email')?.invalid && reactiveForm.get('email')?.touched)"
                aria-describedby="r-email-error"
              />
              @if (reactiveForm.get('email')?.invalid && reactiveForm.get('email')?.touched) {
                <p id="r-email-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (reactiveForm.get('email')?.errors?.['required']) { Email is required }
                  @if (reactiveForm.get('email')?.errors?.['email']) { Enter a valid email address }
                </p>
              }
            </div>

            <div>
              <label for="r-password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="r-password"
                type="password"
                formControlName="password"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="reactiveForm.get('password')?.invalid && reactiveForm.get('password')?.touched"
                [class.border-slate-300]="!(reactiveForm.get('password')?.invalid && reactiveForm.get('password')?.touched)"
                aria-describedby="r-password-error"
              />
              @if (reactiveForm.get('password')?.invalid && reactiveForm.get('password')?.touched) {
                <p id="r-password-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (reactiveForm.get('password')?.errors?.['required']) { Password is required }
                  @if (reactiveForm.get('password')?.errors?.['minlength']) { Password must be at least 8 characters }
                  @if (reactiveForm.get('password')?.errors?.['pattern']) { Password must contain uppercase, lowercase, and number }
                </p>
              }
            </div>

            <div class="flex items-center gap-4 pt-2">
              <button
                type="submit"
                [disabled]="reactiveForm.invalid || reactiveSubmitted()"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ reactiveSubmitted() ? 'Submitted!' : 'Register (Reactive)' }}
              </button>
              <button
                type="button"
                (click)="resetReactiveForm()"
                class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            </div>

            @if (reactiveSubmitted()) {
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800" role="status">
                <pre class="text-sm">{{ reactiveFormValue() | json }}</pre>
              </div>
            }
          </form>
        </div>
      }

      <!-- Template-Driven Forms Tab -->
      @if (activeTab() === 'template') {
        <div class="bg-white rounded-lg border border-slate-200 p-6" role="tabpanel">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Template-Driven Forms (ngModel)</h2>
          <form #templateForm="ngForm" (ngSubmit)="onTemplateSubmit(templateForm)" class="space-y-4" novalidate>
            <div>
              <label for="t-name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                id="t-name"
                type="text"
                name="name"
                [(ngModel)]="templateModel.name"
                #nameRef="ngModel"
                required
                minlength="2"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="nameRef.invalid && nameRef.touched"
                [class.border-slate-300]="!(nameRef.invalid && nameRef.touched)"
                aria-describedby="t-name-error"
              />
              @if (nameRef.invalid && nameRef.touched) {
                <p id="t-name-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (nameRef.errors?.['required']) { Name is required }
                  @if (nameRef.errors?.['minlength']) { Name must be at least 2 characters }
                </p>
              }
            </div>

            <div>
              <label for="t-email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="t-email"
                type="email"
                name="email"
                [(ngModel)]="templateModel.email"
                #emailRef="ngModel"
                required
                email
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="emailRef.invalid && emailRef.touched"
                [class.border-slate-300]="!(emailRef.invalid && emailRef.touched)"
                aria-describedby="t-email-error"
              />
              @if (emailRef.invalid && emailRef.touched) {
                <p id="t-email-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (emailRef.errors?.['required']) { Email is required }
                  @if (emailRef.errors?.['email']) { Enter a valid email address }
                </p>
              }
            </div>

            <div>
              <label for="t-password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="t-password"
                type="password"
                name="password"
                [(ngModel)]="templateModel.password"
                #passwordRef="ngModel"
                required
                minlength="8"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                [class.border-red-500]="passwordRef.invalid && passwordRef.touched"
                [class.border-slate-300]="!(passwordRef.invalid && passwordRef.touched)"
                aria-describedby="t-password-error"
              />
              @if (passwordRef.invalid && passwordRef.touched) {
                <p id="t-password-error" class="mt-1 text-sm text-red-600" role="alert">
                  @if (passwordRef.errors?.['required']) { Password is required }
                  @if (passwordRef.errors?.['minlength']) { Password must be at least 8 characters }
                  @if (passwordRef.errors?.['pattern']) { Password must contain uppercase, lowercase, and number }
                </p>
              }
            </div>

            <div class="flex items-center gap-4 pt-2">
              <button
                type="submit"
                [disabled]="templateForm.invalid || templateSubmitted()"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ templateSubmitted() ? 'Submitted!' : 'Register (Template-Driven)' }}
              </button>
              <button
                type="button"
                (click)="resetTemplateForm(templateForm)"
                class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            </div>

            @if (templateSubmitted()) {
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800" role="status">
                <pre class="text-sm">{{ templateFormValue() | json }}</pre>
              </div>
            }
          </form>
        </div>
      }

      <!-- Comparison Tab -->
      @if (activeTab() === 'comparison') {
        <div class="bg-white rounded-lg border border-slate-200 p-6" role="tabpanel">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Reactive vs Template-Driven Forms</h2>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Reactive Forms Column -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Reactive Forms
              </h3>
              <ul class="space-y-2 text-slate-700 text-sm">
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Explicit, immutable form model in component class</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Easy unit testing — form logic isolated from template</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Dynamic forms: add/remove controls at runtime</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Synchronous access to values & validation state</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Better for complex validation (cross-field, async)</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Observable-based (valueChanges, statusChanges)</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> More boilerplate code</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Steeper learning curve</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Must keep template & component in sync</li>
              </ul>
            </div>

            <!-- Template-Driven Forms Column -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Template-Driven Forms
              </h3>
              <ul class="space-y-2 text-slate-700 text-sm">
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Less boilerplate — logic lives in template</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Familiar to AngularJS developers</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Simpler for basic forms with few fields</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Two-way binding with [(ngModel)]</li>
                <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Direct access to NgModel refs (#ref="ngModel")</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Harder to unit test (logic in template)</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Async validation more cumbersome</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Less control over form model lifecycle</li>
                <li class="flex items-start gap-2"><span class="text-orange-500">⚠</span> Cross-field validation requires custom directives</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 class="font-medium text-slate-900 mb-2">When to Use Which?</h4>
            <ul class="space-y-1 text-sm text-slate-700">
              <li><strong>Reactive Forms:</strong> Complex forms, dynamic fields, heavy validation, teams prioritizing testability, enterprise apps</li>
              <li><strong>Template-Driven:</strong> Simple forms, prototyping, small forms with static fields, migration from AngularJS</li>
            </ul>
            <p class="mt-3 text-sm text-slate-600">
              Both approaches share the same validation logic (Validators.required, Validators.minLength, Validators.pattern, Validators.email).
              The template-driven form uses the same validator functions via directives (required, minlength, pattern, email).
            </p>
          </div>
        </div>
      }

      <!-- Dynamic FormArray Tab -->
      @if (activeTab() === 'formarray') {
        <div class="bg-white rounded-lg border border-slate-200 p-6" role="tabpanel">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Dynamic FormArray — Skills List</h2>
          <p class="text-slate-600 mb-6">Add/remove skill entries dynamically. Each row validates independently. Minimum 1 skill required.</p>

          <form [formGroup]="skillsForm" (ngSubmit)="onSkillsSubmit()" class="space-y-4" novalidate>
            <div formArrayName="skills">
              @for (skill of skillsArray.controls; track skill; let i = $index) {
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200" [formGroupName]="i">
                  <div class="flex items-start gap-4">
                    <div class="flex-1 space-y-4">
                      <div class="grid md:grid-cols-2 gap-4">
                        <div>
                          <label [for]="'skill-name-' + i" class="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                          <input
                            [id]="'skill-name-' + i"
                            type="text"
                            formControlName="skillName"
                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            [class.border-red-500]="skill.get('skillName')?.invalid && skill.get('skillName')?.touched"
                            [class.border-slate-300]="!(skill.get('skillName')?.invalid && skill.get('skillName')?.touched)"
                            [attr.aria-describedby]="'skill-name-error-' + i"
                          />
                          @if (skill.get('skillName')?.invalid && skill.get('skillName')?.touched) {
                            <p [id]="'skill-name-error-' + i" class="mt-1 text-sm text-red-600" role="alert">
                              @if (skill.get('skillName')?.errors?.['required']) { Skill name is required }
                              @if (skill.get('skillName')?.errors?.['minlength']) { Skill name must be at least 2 characters }
                            </p>
                          }
                        </div>

                        <div>
                          <label [for]="'years-exp-' + i" class="block text-sm font-medium text-slate-700 mb-1">Years Experience</label>
                          <input
                            [id]="'years-exp-' + i"
                            type="number"
                            formControlName="yearsExperience"
                            min="0"
                            max="50"
                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            [class.border-red-500]="skill.get('yearsExperience')?.invalid && skill.get('yearsExperience')?.touched"
                            [class.border-slate-300]="!(skill.get('yearsExperience')?.invalid && skill.get('yearsExperience')?.touched)"
                            [attr.aria-describedby]="'years-exp-error-' + i"
                          />
                          @if (skill.get('yearsExperience')?.invalid && skill.get('yearsExperience')?.touched) {
                            <p [id]="'years-exp-error-' + i" class="mt-1 text-sm text-red-600" role="alert">
                              @if (skill.get('yearsExperience')?.errors?.['required']) { Years of experience is required }
                              @if (skill.get('yearsExperience')?.errors?.['min']) { Must be 0 or greater }
                              @if (skill.get('yearsExperience')?.errors?.['max']) { Must be 50 or less }
                            </p>
                          }
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      (click)="removeSkill(i)"
                      [disabled]="skillsArray.length <= 1"
                      class="self-start px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      [attr.aria-label]="'Remove skill ' + (i + 1)"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      <span class="sr-only">Remove</span>
                    </button>
                  </div>
                </div>
              }
            </div>

            <div class="flex items-center gap-4 pt-2">
              <button
                type="button"
                (click)="addSkill()"
                class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Skill
              </button>
              <button
                type="submit"
                [disabled]="skillsForm.invalid || skillsSubmitted()"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ skillsSubmitted() ? 'Submitted!' : 'Submit Skills' }}
              </button>
              <button
                type="button"
                (click)="resetSkillsForm()"
                class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            </div>

            @if (skillsSubmitted()) {
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800" role="status">
                <h3 class="font-medium mb-2">Submitted Skills Array:</h3>
                <pre class="text-sm">{{ skillsFormValue() | json }}</pre>
              </div>
            }
          </form>
        </div>
      }
    </section>
  `,
})
export default class FormsComponent {
  activeTab = signal<'reactive' | 'template' | 'comparison' | 'async' | 'formarray'>('reactive');
  reactiveSubmitted = signal(false);
  templateSubmitted = signal(false);
  skillsSubmitted = signal(false);
  reactiveFormValue = signal<Record<string, unknown> | null>(null);
  templateFormValue = signal<Record<string, unknown> | null>(null);
  skillsFormValue = signal<Record<string, unknown> | null>(null);

  reactiveForm: FormGroup;
  skillsForm: FormGroup;
  templateModel = { name: '', email: '', password: '' };

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+')
      ]],
    });

    this.skillsForm = this.fb.group({
      skills: this.fb.array([
        this.createSkillGroup()
      ])
    });
  }

  get skillsArray(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  private createSkillGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      yearsExperience: ['', [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }

  addSkill(): void {
    this.skillsArray.push(this.createSkillGroup());
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  onSkillsSubmit(): void {
    if (this.skillsForm.valid) {
      this.skillsFormValue.set(this.skillsForm.value);
      this.skillsSubmitted.set(true);
    } else {
      this.skillsForm.markAllAsTouched();
      this.skillsArray.controls.forEach(control => control.markAllAsTouched());
    }
  }

  resetSkillsForm(): void {
    while (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(0);
    }
    this.skillsArray.at(0).reset();
    this.skillsSubmitted.set(false);
    this.skillsFormValue.set(null);
  }

  onReactiveSubmit(): void {
    if (this.reactiveForm.valid) {
      this.reactiveFormValue.set(this.reactiveForm.value);
      this.reactiveSubmitted.set(true);
    } else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  resetReactiveForm(): void {
    this.reactiveForm.reset();
    this.reactiveSubmitted.set(false);
    this.reactiveFormValue.set(null);
  }

  onTemplateSubmit(form: NgForm): void {
    if (form.valid) {
      this.templateFormValue.set({ ...this.templateModel });
      this.templateSubmitted.set(true);
    } else {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
  }

  resetTemplateForm(form: NgForm): void {
    form.resetForm();
    this.templateModel = { name: '', email: '', password: '' };
    this.templateSubmitted.set(false);
    this.templateFormValue.set(null);
  }
}