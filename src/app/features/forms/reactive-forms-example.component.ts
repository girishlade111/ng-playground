import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reactive-forms-example',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <section class="space-y-6 max-w-2xl mx-auto">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-indigo-600">Reactive Forms Example</h1>
        <p class="text-slate-700">User registration with cross-field password validation</p>
      </header>

      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              [class.border-red-500]="name.invalid && name.touched"
              [class.border-slate-300]="!(name.invalid && name.touched)"
              aria-describedby="name-error"
            />
            @if (name.invalid && name.touched) {
              <p id="name-error" class="mt-1 text-sm text-red-600" role="alert">
                @if (name.errors?.['required']) { Name is required }
                @if (name.errors?.['minlength']) { Name must be at least 2 characters }
              </p>
            }
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              [class.border-red-500]="email.invalid && email.touched"
              [class.border-slate-300]="!(email.invalid && email.touched)"
              aria-describedby="email-error"
            />
            @if (email.invalid && email.touched) {
              <p id="email-error" class="mt-1 text-sm text-red-600" role="alert">
                @if (email.errors?.['required']) { Email is required }
                @if (email.errors?.['email']) { Enter a valid email address }
              </p>
            }
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              [class.border-red-500]="password.invalid && password.touched"
              [class.border-slate-300]="!(password.invalid && password.touched)"
              aria-describedby="password-error"
            />
            @if (password.invalid && password.touched) {
              <p id="password-error" class="mt-1 text-sm text-red-600" role="alert">
                @if (password.errors?.['required']) { Password is required }
                @if (password.errors?.['minlength']) { Password must be at least 8 characters }
              </p>
            }
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              [class.border-red-500]="confirmPassword.invalid && confirmPassword.touched"
              [class.border-slate-300]="!(confirmPassword.invalid && confirmPassword.touched)"
              aria-describedby="confirmPassword-error"
            />
            @if (confirmPassword.invalid && confirmPassword.touched) {
              <p id="confirmPassword-error" class="mt-1 text-sm text-red-600" role="alert">
                @if (confirmPassword.errors?.['required']) { Please confirm your password }
              </p>
            }
            @if (registrationForm.errors?.['passwordMismatch'] && confirmPassword.touched) {
              <p id="confirmPassword-error" class="mt-1 text-sm text-red-600" role="alert">
                Passwords do not match
              </p>
            }
          </div>

          <!-- Submit Button -->
          <div class="flex items-center gap-4 pt-2">
            <button
              type="submit"
              [disabled]="registrationForm.invalid || submitted()"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitted() ? 'Submitted!' : 'Register' }}
            </button>
            <button
              type="button"
              (click)="resetForm()"
              class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            >
              Reset
            </button>
          </div>

          <!-- Result Panel -->
          @if (submitted()) {
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800" role="status">
              <h3 class="font-medium mb-2">Form Submitted Successfully</h3>
              <pre class="text-sm">{{ formValue() | json }}</pre>
            </div>
          }
        </form>
      </div>
    </section>
  `,
})
export default class ReactiveFormsExampleComponent {
  submitted = signal(false);
  formValue = signal<Record<string, unknown> | null>(null);

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator });
  }

  get name() {
    return this.registrationForm.get('name')!;
  }

  get email() {
    return this.registrationForm.get('email')!;
  }

  get password() {
    return this.registrationForm.get('password')!;
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword')!;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.formValue.set(this.registrationForm.value);
      this.submitted.set(true);
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.submitted.set(false);
    this.formValue.set(null);
  }
}