import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-heavy-viewport',
  standalone: true,
  template: `
    <div class="rounded-lg border-2 border-solid border-indigo-500 p-6 bg-indigo-50 text-center">
      <div class="text-indigo-800 font-bold text-lg">✅ Viewport Component Loaded</div>
      <div class="text-sm text-indigo-600 mt-2">Loaded via <code>on viewport</code> trigger</div>
      <div class="text-xs text-indigo-400 mt-1">Chunk: heavy-viewport.component.js</div>
      <div class="mt-4 p-3 bg-white rounded border border-indigo-200 text-left text-sm">
        <div class="font-mono">ngOnInit delay: {{ initDelay }}ms</div>
        <div class="font-mono">Constructor delay: {{ constructorDelay }}ms</div>
        <div class="font-mono">Current count: {{ count() }}</div>
      </div>
    </div>
  `,
})
export class HeavyViewportComponent implements OnInit {
  count = signal(0);
  initDelay = 0;
  constructorDelay = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const start = performance.now();
    // Simulate heavy constructor work
    this.heavyComputation(50);
    this.constructorDelay = Math.round(performance.now() - start);
    console.log('[HeavyViewportComponent] Constructor completed');

    // effect() must run in an injection context (constructor), not ngOnInit.
    effect(() => {
      if (this.count() > 10) {
        this.clearTimer();
      }
    });
    destroyRef.onDestroy(() => this.clearTimer());
  }

  ngOnInit() {
    const start = performance.now();
    // Simulate heavy initialization
    this.heavyComputation(100);
    this.initDelay = Math.round(performance.now() - start);
    console.log('[HeavyViewportComponent] ngOnInit completed');

    // Simulate ongoing work
    this.intervalId = setInterval(() => {
      this.count.update((c) => c + 1);
    }, 1000);
  }

  private clearTimer(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private heavyComputation(ms: number) {
    const end = performance.now() + ms;
    while (performance.now() < end) {
      // Busy wait to simulate CPU-intensive work.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      Math.random() * Math.random();
    }
  }
}