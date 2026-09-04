import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private readonly STORAGE_KEY = 'dark-mode';
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved ? JSON.parse(saved) : prefersDark;
      this.isDark.set(initial);
      this.applyTheme(initial);
    }
  }

  private readonly syncEffect = effect(() => {
    if (!isPlatformBrowser(this.platformId)) return;
    const dark = this.isDark();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dark));
    this.applyTheme(dark);
  });

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  private applyTheme(dark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}