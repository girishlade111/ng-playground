import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessControlService {
  private readonly _accessGranted = signal(false);

  readonly accessGranted = this._accessGranted.asReadonly();

  toggleAccess(): void {
    this._accessGranted.update((value) => !value);
  }

  grantAccess(): void {
    this._accessGranted.set(true);
  }

  revokeAccess(): void {
    this._accessGranted.set(false);
  }
}