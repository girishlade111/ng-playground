import { Injectable, signal, computed } from '@angular/core';
import { ToastMessage } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(toast: Omit<ToastMessage, 'id'>): string {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { ...toast, id };
    this._toasts.update((toasts) => [...toasts, newToast]);

    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  error(title: string, message: string, duration?: number): string {
    return this.show({ type: 'error', title, message, duration });
  }

  success(title: string, message: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }

  dismiss(id: string): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}