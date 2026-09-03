import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="space-y-8 max-w-2xl">
      <header>
        <h1 class="text-3xl font-bold text-indigo-600">Reactive Forms</h1>
        <p class="text-slate-700 mt-1">User registration with sync validators and cross-field validation.</p>
      </header>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6" novalidate>
        <div class="space-y-1.5">
          <label for="name" class="block text-sm font-medium text-slate-700">Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            [class.border-red-500]="name.invalid && (name.dirty || name.touched)"
            [class.border-slate-300]="name.valid || (name.pristine && !name.touched)"
            placeholder="John Doe"
          />
          @if (name.invalid && (name.dirty || name.touched)) {
            <div class="text-sm text-red-600" role="alert">
              @if (name.errors?.['required']) { <span>Name is required</span> }
              @if (name.errors?.['minlength']) { <span>Name must be at least 2 characters</span> }
            </div>
          }
        </div>

        <div class="space-y-1.5">
          <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            [class.border-red-500]="email.invalid && (email.dirty || email.touched)"
            [class.border-slate-300]="email.valid || (email.pristine && !email.touched)"
            placeholder="john@example.com"
          />
          @if (email.invalid && (email.dirty || email.touched)) {
            <div class="text-sm text-red-600" role="alert">
              @if (email.errors?.['required']) { <span>Email is required</span> }
              @if (email.errors?.['email']) { <span>Enter a valid email address</span> }
            </div>
          }
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            [class.border-red-500]="password.invalid && (password.dirty || password.touched)"
            [class.border-slate-300]="password.valid || (password.pristine && !password.touched)"
            placeholder="••••••••"
          />
          @if (password.invalid && (password.dirty || password.touched)) {
            <div class="text-sm text-red-600" role="alert">
              @if (password.errors?.['required']) { <span>Password is required</span> }
              @if (password.errors?.['minlength']) { <span>Password must be at least 8 characters</span> }
            </div>
          }
        </div>

        <div class="space-y-1.5">
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            [class.border-red-500]="confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched)"
            [class.border-slate-300]="confirmPassword.valid || (confirmPassword.pristine && !confirmPassword.touched)"
            placeholder="••••••••"
          />
          @if (confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched)) {
            <div class="text-sm text-red-600" role="alert">
              @if (confirmPassword.errors?.['required']) { <span>Please confirm your password</span> }
            </div>
          }
          @if (registerForm.errors?.['passwordMismatch'] && (confirmPassword.dirty || confirmPassword.touched)) {
            <div class="text-sm text-red-600" role="alert">Passwords do not match</div>
          }
        </div>

        <button
          type="submit"
          [disabled]="registerForm.invalid"
          class="w-full py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Register
        </button>
      </form>

      @if (submittedValue) {
        <div class="rounded-lg bg-green-50 border border-green-200 p-4">
          <h3 class="font-semibold text-green-800 mb-2">Submitted Form Value</h3>
          <pre class="text-sm text-green-700 bg-green-100 p-3 rounded overflow-auto">{{ submittedValue }}</pre>
        </div>
      }
    </section>
  `,
})
export default class FormsComponent {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  submittedValue: string | null = null;

  get name() { return this.registerForm.get('name')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.submittedValue = JSON.stringify(this.registerForm.value, null, 2);
      this.registerForm.reset();
    }
  }
}