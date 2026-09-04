import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpLogService } from '../../../core/services/http-log.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpLogEntry } from '../../../core/models/http-log.model';

@Component({
  selector: 'app-http-log-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 w-full max-w-2xl px-4 sm:px-0">
      <div class="rounded-[18px] bg-white border border-black/10 overflow-hidden">
        <div class="frosted-parchment flex items-center justify-between border-b border-black/[0.08] px-4 py-3">
          <h2 class="text-[14px] font-semibold tracking-[-0.224px] text-ink">HTTP Request Log</h2>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">
              {{ pendingCount() }} pending
              <span class="mx-1">|</span>
              {{ successCount() }} ok
              <span class="mx-1">|</span>
              {{ errorCount() }} error
            </span>
            <button
              type="button"
              (click)="toggleCollapsed()"
              class="text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Toggle log panel"
            >
              <svg
                class="h-5 w-5"
                [class.rotate-180]="collapsed()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              (click)="clearLogs()"
              class="text-slate-500 hover:text-red-600 transition-colors"
              aria-label="Clear logs"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        @if (!collapsed()) {
          <div class="max-h-96 overflow-y-auto">
            @if (logService.entries().length === 0) {
              <div class="p-8 text-center text-slate-500 text-sm">
                No HTTP requests logged yet
              </div>
            } @else {
              <div class="divide-y divide-slate-100">
                @for (entry of logService.entries(); track $index) {
                  <div class="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start gap-3">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        [class]="getMethodClass(entry.method)"
                      >
                        {{ entry.method }}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-slate-900 truncate">{{ entry.url }}</span>
                          <span class="text-xs text-slate-500 whitespace-nowrap ml-2">
                            {{ formatTime(entry.timestamp) }}
                          </span>
                        </div>
                        <div class="flex items-center gap-4 mt-1 text-xs">
                          <span class="flex items-center gap-1" [class]="getStatusClass(entry.status)">
                            <span class="w-1.5 h-1.5 rounded-full" [class]="getStatusDotClass(entry.status)"></span>
                            {{ getStatusText(entry.status) }}
                          </span>
                          @if (entry.duration !== undefined) {
                            <span class="text-slate-500">{{ entry.duration }}ms</span>
                          }
                          @if (entry.responseSize !== undefined && entry.responseSize > 0) {
                            <span class="text-slate-500">{{ formatBytes(entry.responseSize) }}</span>
                          }
                          @if (entry.error) {
                            <span class="text-red-600">{{ entry.error }}</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class HttpLogPanelComponent {
  protected readonly logService = inject(HttpLogService);
  private readonly toastService = inject(ToastService);

  protected readonly collapsed = signal(false);

  protected readonly pendingCount = this.logService.pendingCount;
  protected readonly successCount = this.logService.successCount;
  protected readonly errorCount = this.logService.errorCount;

  protected toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }

  protected clearLogs(): void {
    this.logService.clear();
    this.toastService.info('Logs Cleared', 'HTTP request log has been cleared');
  }

  protected getMethodClass(method: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-[-0.12px]';
    switch (method) {
      case 'GET':
        return `${base} bg-action/10 text-action`;
      case 'POST':
        return `${base} bg-green-600/10 text-green-700`;
      case 'PUT':
      case 'PATCH':
        return `${base} bg-amber-500/15 text-amber-700`;
      case 'DELETE':
        return `${base} bg-red-600/10 text-red-600`;
      default:
        return `${base} bg-black/[0.06] text-ink-soft`;
    }
  }

  protected getStatusClass(status: 'pending' | number): string {
    if (status === 'pending') return 'text-slate-500';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    return 'text-red-600';
  }

  protected getStatusDotClass(status: 'pending' | number): string {
    if (status === 'pending') return 'bg-slate-400 animate-pulse';
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  protected getStatusText(status: 'pending' | number): string {
    if (status === 'pending') return 'Pending...';
    if (status >= 200 && status < 300) return `${status} OK`;
    if (status >= 300 && status < 400) return `${status} Redirect`;
    if (status >= 400 && status < 500) return `${status} Client Error`;
    return `${status} Server Error`;
  }

  protected formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  protected formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}