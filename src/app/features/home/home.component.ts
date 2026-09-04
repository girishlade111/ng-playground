import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FeatureCard {
  readonly path: string;
  readonly label: string;
  readonly description: string;
  /** Two-letter monogram set in the tile glyph block. */
  readonly mark: string;
}

/**
 * DESIGN.md gallery rhythm: light hero → dark product tile →
 * parchment utility grid → dark editorial tile → parchment footer.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <!-- product-tile-light: hero -->
    <section class="tile tile-light">
      <div class="mx-auto max-w-[980px] px-6 text-center">
        <p class="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-action">
          Angular 18+ &middot; Standalone lab
        </p>
        <h1 class="hero-display mt-3 text-ink">ng-playground.</h1>
        <p class="mx-auto mt-4 max-w-2xl font-display text-[21px] font-normal leading-[1.19] tracking-[0.231px] text-ink sm:text-[28px] sm:leading-[1.14] sm:tracking-[0.196px]">
          A quiet gallery of modern Angular. Signals, forms, SSR, and zoneless — each one on its own pedestal.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a routerLink="/signals" class="btn-apple">Start exploring</a>
          <a href="#tiles" class="btn-apple-ghost">Browse the tiles</a>
        </div>

        <!-- Product render: the single allowed product shadow -->
        <div class="mx-auto mt-16 max-w-2xl overflow-hidden rounded-[18px] border border-black/10 bg-white text-left shadow-product">
          <div class="flex items-center gap-2 border-b border-black/[0.08] bg-canvas-parchment px-4 py-3">
            <span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
            <span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
            <span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-2 font-mono text-[12px] text-ink-mute">signals.component.ts</span>
          </div>
          <pre class="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-ink"><code><span class="text-action">const</span> count = <span class="text-action">signal</span>(0);
<span class="text-action">const</span> doubled = <span class="text-action">computed</span>(() => count() * 2);

<span class="text-action">effect</span>(() => {{ '{' }}
  console.<span class="text-action">log</span>(<span class="text-[#0550ae]">'count is'</span>, count());
{{ '}' }});</code></pre>
        </div>
      </div>
    </section>

    <!-- product-tile-dark: proof band -->
    <section class="tile tile-dark">
      <div class="mx-auto max-w-[980px] px-6 text-center">
        <h2 class="font-display text-[34px] font-semibold leading-[1.1] text-white sm:text-[40px]">
          One lab. Every modern primitive.
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-[#cccccc]">
          Nine interactive exhibits, lazy-loaded at the route boundary. No chrome competing with the content.
        </p>
        <dl class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <dt class="order-2 mt-1 block text-[14px] font-normal leading-[1.43] tracking-[-0.224px] text-[#cccccc]">interactive exhibits</dt>
            <dd class="order-1 font-display text-[40px] font-semibold leading-[1.1] text-white">9</dd>
          </div>
          <div>
            <dt class="order-2 mt-1 block text-[14px] font-normal leading-[1.43] tracking-[-0.224px] text-[#cccccc]">standalone components</dt>
            <dd class="order-1 font-display text-[40px] font-semibold leading-[1.1] text-white">100%</dd>
          </div>
          <div>
            <dt class="order-2 mt-1 block text-[14px] font-normal leading-[1.43] tracking-[-0.224px] text-[#cccccc]">zone.js required</dt>
            <dd class="order-1 font-display text-[40px] font-semibold leading-[1.1] text-white">0</dd>
          </div>
        </dl>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-[17px]">
          <a routerLink="/zoneless" class="link-apple-ondark">Why zoneless &gt;</a>
          <a routerLink="/ssr-defer" class="link-apple-ondark">How defer works &gt;</a>
        </div>
      </div>
    </section>

    <!-- product-tile-parchment: utility grid + search -->
    <section id="tiles" class="tile tile-parchment scroll-mt-28">
      <div class="mx-auto max-w-[1440px] px-6">
        <div class="mx-auto max-w-[980px] text-center">
          <h2 class="font-display text-[34px] font-semibold leading-[1.1] text-ink sm:text-[40px]">The collection.</h2>
          <p class="mx-auto mt-3 max-w-xl text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-soft">
            Each tile is a working exhibit. Search the index, then step inside.
          </p>
          <div class="relative mx-auto mt-8 max-w-md">
            <svg class="pointer-events-none absolute left-5 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-ink-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="search"
              class="search-apple"
              placeholder="Search exhibits"
              aria-label="Search exhibits"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
            />
          </div>
        </div>

        <div class="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          @for (feature of filtered(); track feature.path) {
            <article class="card-utility flex flex-col">
              <div class="mb-5 inline-flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-canvas-parchment">
                <span class="font-display text-[21px] font-semibold tracking-[-0.01em] text-ink">{{ feature.mark }}</span>
              </div>
              <h3 class="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">{{ feature.label }}</h3>
              <p class="mb-5 mt-1 flex-1 text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-soft">{{ feature.description }}</p>
              <a [routerLink]="feature.path" class="link-apple text-[17px] font-normal" [attr.aria-label]="'Explore ' + feature.label">
                Explore &gt;
              </a>
            </article>
          } @empty {
            <div class="card-utility col-span-full py-12 text-center">
              <p class="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">No exhibits match &ldquo;{{ query() }}&rdquo;.</p>
              <button type="button" (click)="query.set('')" class="link-apple mt-2 text-[17px]">Clear the search</button>
            </div>
          }
        </div>
        <p class="mt-8 text-center text-[12px] font-normal leading-none tracking-[-0.12px] text-ink-mute">
          Showing {{ filtered().length }} of {{ features.length }} exhibits
        </p>
      </div>
    </section>

    <!-- product-tile-dark-2: editorial close -->
    <section class="tile tile-dark-2">
      <div class="mx-auto max-w-[980px] px-6 text-center">
        <p class="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[#cccccc]">Start with data</p>
        <h2 class="mx-auto mt-3 max-w-2xl font-display text-[34px] font-semibold leading-[1.1] text-white sm:text-[40px]">
          CRUD, with optimistic updates and honest errors.
        </h2>
        <div class="mt-8">
          <a routerLink="/crud" class="btn-apple">Open the CRUD lab</a>
        </div>
      </div>
    </section>
  `,
})
export default class HomeComponent {
  protected readonly query = signal('');

  protected readonly features: readonly FeatureCard[] = [
    { path: '/signals', label: 'Signals', description: 'Reactive state with fine-grained reactivity and computed values.', mark: 'Sg' },
    { path: '/forms', label: 'Forms', description: 'Template-driven and reactive forms with validation.', mark: 'Fo' },
    { path: '/crud', label: 'CRUD', description: 'Data operations with optimistic updates and error handling.', mark: 'Da' },
    { path: '/ssr-defer', label: 'SSR @defer', description: 'Incremental hydration and deferred loading for performance.', mark: 'Df' },
    { path: '/rxjs', label: 'RxJS', description: 'Reactive streams, operators, and observable patterns.', mark: 'Rx' },
    { path: '/di', label: 'Dependency Injection', description: 'Hierarchical injectors, tokens, and modern DI patterns.', mark: 'DI' },
    { path: '/router', label: 'Router', description: 'Guards, lazy loading, and protected-route patterns.', mark: 'Rt' },
    { path: '/animations', label: 'Animations', description: 'Triggers, transitions, and keyframes in motion.', mark: 'An' },
    { path: '/zoneless', label: 'Zoneless', description: 'Zone.js-free change detection with signal reactivity.', mark: 'Zl' },
  ];

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.features;
    return this.features.filter(
      (f) => f.label.toLowerCase().includes(q) || f.description.toLowerCase().includes(q),
    );
  });
}
