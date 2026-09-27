import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-heavy-idle',
  standalone: true,
  template: `
    <div class="rounded-lg border-2 border-solid border-emerald-500 p-6 bg-emerald-50 text-center">
      <div class="text-emerald-800 font-bold text-lg">✅ Idle Component Loaded</div>
      <div class="text-sm text-emerald-600 mt-2">Loaded via <code>on idle</code> trigger</div>
      <div class="text-xs text-emerald-400 mt-1">Chunk: heavy-idle.component.js</div>
      <div class="mt-4 p-3 bg-white rounded border border-emerald-200 text-left text-sm">
        <div class="font-mono">ngOnInit delay: {{ initDelay }}ms</div>
        <div class="font-mono">Constructor delay: {{ constructorDelay }}ms</div>
        <div class="font-mono">Current count: {{ count() }}</div>
      </div>
    </div>
  `,
})
export class HeavyIdleComponent implements OnInit {
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
    console.log('[HeavyIdleComponent] Constructor completed');

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
    console.log('[HeavyIdleComponent] ngOnInit completed');

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