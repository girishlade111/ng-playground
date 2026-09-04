import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private readonly STORAGE_KEY = 'dark-mode';
  protected readonly isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? JSON.parse(saved) : prefersDark;
    this.isDark.set(initial);
    this.applyTheme(initial);
  }

  private readonly syncEffect = effect(() => {
    const dark = this.isDark();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dark));
    this.applyTheme(dark);
  });

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}