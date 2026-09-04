import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { ToastMessage } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="fixed top-[60px] right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto animate-slide-in rounded-[18px] border border-black/10 bg-white/90 overflow-hidden backdrop-blur-xl"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-start gap-3 p-4">
            <div class="flex-shrink-0 mt-0.5" [class]="getIconClasses(toast.type)">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                @switch (toast.type) {
                  @case ('error') {
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  }
                  @case ('success') {
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  }
                  @case ('warning') {
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  }
                  @default {
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  }
                }
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" [class]="getTitleClasses(toast.type)">{{ toast.title }}</p>
              <p class="mt-1 text-sm" [class]="getMessageClasses(toast.type)">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              (click)="dismiss(toast.id)"
              class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-25 animate-progress" [style.animation-duration]="getDuration(toast) + 'ms'"></div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }

      .animate-progress {
        animation: progress linear forwards;
      }
    `,
  ],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  protected dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  protected getToastClasses(type: ToastMessage['type']): string {
    // Frosted white card for every tone; the icon carries the signal color.
    return 'rounded-[18px] border border-black/10 bg-white/90 backdrop-blur-xl';
  }

  protected getIconClasses(type: ToastMessage['type']): string {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
      default:
        return 'text-action';
    }
  }

  protected getTitleClasses(type: ToastMessage['type']): string {
    return 'text-ink text-[17px] font-semibold tracking-[-0.374px]';
  }

  protected getMessageClasses(type: ToastMessage['type']): string {
    return 'text-ink-soft text-[14px] tracking-[-0.224px]';
  }

  protected getDuration(toast: ToastMessage): number {
    return toast.duration ?? 5000;
  }
}