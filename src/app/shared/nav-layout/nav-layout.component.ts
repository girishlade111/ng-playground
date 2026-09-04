import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

interface NavItem {
  readonly path: string;
  readonly label: string;
}

/**
 * DESIGN.md `global-nav` + `sub-nav-frosted`.
 * Thin black bar (44px, 12px links) pinned on top; frosted parchment
 * strip (52px) below with the section name and a persistent pill CTA.
 */
@Component({
  selector: 'app-nav-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLink, RouterLinkActive],
  template: `
    <!-- global-nav: true black, 44px, quiet 12px links -->
    <nav aria-label="Global" class="sticky top-0 z-50 bg-black text-white">
      <div class="mx-auto flex h-11 max-w-[1024px] items-center justify-between px-4">
        <a routerLink="/" class="flex items-center gap-2" aria-label="ng-playground home">
          <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3L19.4 8 12 12 4.6 8 12 4.3zM5 9.7l6 3.4v6.5l-6-3.4V9.7zm8 3.4l6-3.4v6.6l-6 3.4v-6.6z" />
          </svg>
          <span class="sr-only">ng-playground</span>
        </a>

        <ul class="hidden items-center gap-5 md:flex">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="!text-white"
                [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                class="text-[12px] font-normal leading-none tracking-[-0.12px] text-white/80 transition-colors hover:text-white"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="toggle()"
            class="inline-flex h-11 w-11 items-center justify-center text-white/80 transition-colors hover:text-white md:hidden"
            [attr.aria-expanded]="open()"
            aria-controls="primary-nav"
            aria-label="Toggle navigation menu"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              @if (open()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile tray: replaces the link row at ≤ 834px -->
      <div
        id="primary-nav"
        [ngClass]="open() ? 'block' : 'hidden'"
        class="border-t border-white/10 bg-black md:hidden"
      >
        <ul class="space-y-1 px-4 py-3">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                (click)="close()"
                class="block rounded-[8px] px-3 py-2 text-[14px] text-white/80 hover:bg-white/10 hover:text-white"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </div>
    </nav>

    <!-- sub-nav-frosted: parchment 80% + blur, 52px, category + pill CTA -->
    <div class="frosted-parchment sticky top-11 z-40 border-b border-black/[0.08]">
      <div class="mx-auto flex h-[52px] max-w-[1024px] items-center justify-between gap-4 px-4">
        <div class="flex min-w-0 items-baseline gap-3">
          <a routerLink="/" class="truncate font-display text-[21px] font-semibold leading-[1.19] tracking-[0.231px] text-ink">
            ng-playground
          </a>
          <span class="hidden truncate text-[14px] font-normal tracking-[-0.224px] text-ink-mute sm:inline">
            {{ currentLabel() }}
          </span>
        </div>
        <div class="flex shrink-0 items-center gap-4">
          <a routerLink="/" class="hidden text-[14px] font-normal tracking-[-0.224px] text-ink-soft hover:text-action md:inline">
            Overview
          </a>
          <a routerLink="/crud" class="hidden text-[14px] font-normal tracking-[-0.224px] text-ink-soft hover:text-action md:inline">
            Examples
          </a>
          <a routerLink="/signals" class="btn-apple !min-h-[32px] !px-[15px] !py-[6px] !text-[14px]">
            Start exploring
          </a>
        </div>
      </div>
    </div>
  `,
})
export default class NavLayoutComponent {
  protected readonly darkMode = inject(DarkModeService);
  private readonly router = inject(Router);
  protected readonly open = signal(false);
  protected readonly isDark = this.darkMode.isDark;

  protected readonly navItems: readonly NavItem[] = [
    { path: '/signals', label: 'Signals' },
    { path: '/forms', label: 'Forms' },
    { path: '/crud', label: 'CRUD' },
    { path: '/ssr-defer', label: 'SSR @defer' },
    { path: '/rxjs', label: 'RxJS' },
    { path: '/di', label: 'DI' },
    { path: '/router', label: 'Router' },
    { path: '/animations', label: 'Animations' },
    { path: '/zoneless', label: 'Zoneless' },
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentLabel = (): string => {
    const url = this.currentUrl();
    const match = this.navItems.find((i) => url === i.path || (i.path !== '/' && url.startsWith(i.path)));
    return match ? `${match.label} · Angular 18+ lab` : 'Angular 18+ lab';
  };

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
