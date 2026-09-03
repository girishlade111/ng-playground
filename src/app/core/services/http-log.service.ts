import { Injectable, signal, computed } from '@angular/core';
import { HttpLogEntry } from '../models/http-log.model';

@Injectable({
  providedIn: 'root',
})
export class HttpLogService {
  private readonly _entries = signal<HttpLogEntry[]>([]);

  readonly entries = this._entries.asReadonly();

  readonly pendingCount = computed(() =>
    this._entries().filter((e) => e.status === 'pending').length
  );

  readonly errorCount = computed(() =>
    this._entries().filter((e) => typeof e.status === 'number' && e.status >= 400).length
  );

  readonly successCount = computed(() =>
    this._entries().filter((e) => typeof e.status === 'number' && e.status >= 200 && e.status < 400).length
  );

  addEntry(entry: HttpLogEntry): void {
    this._entries.update((entries) => [...entries, entry]);
  }

  updateLastEntry(partial: Partial<HttpLogEntry>): void {
    this._entries.update((entries) => {
      if (entries.length === 0) return entries;
      const updated = [...entries];
      updated[updated.length - 1] = { ...updated[updated.length - 1], ...partial };
      return updated;
    });
  }

  clear(): void {
    this._entries.set([]);
  }

  removeEntry(index: number): void {
    this._entries.update((entries) => entries.filter((_, i) => i !== index));
  }
}