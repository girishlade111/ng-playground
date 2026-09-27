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

  addEntry(entry: Omit<HttpLogEntry, 'id'>): string {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    this._entries.update((entries) => [...entries, { ...entry, id }]);
    return id;
  }

  updateEntry(id: string, partial: Partial<HttpLogEntry>): void {
    this._entries.update((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, ...partial } : entry))
    );
  }

  clear(): void {
    this._entries.set([]);
  }

  removeEntry(index: number): void {
    this._entries.update((entries) => entries.filter((_, i) => i !== index));
  }
}