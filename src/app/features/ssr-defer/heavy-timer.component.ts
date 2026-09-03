import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-heavy-timer',
  standalone: true,
  template: `
    <div class="rounded-lg border-2 border-solid border-amber-500 p-6 bg-amber-50 text-center">
      <div class="text-amber-800 font-bold text-lg">✅ Timer Component Loaded</div>
      <div class="text-sm text-amber-600 mt-2">Loaded via <code>on timer(3s)</code> trigger</div>
      <div class="text-xs text-amber-400 mt-1">Chunk: heavy-timer.component.js</div>
      <div class="mt-4 p-3 bg-white rounded border border-amber-200 text-left text-sm">
        <div class="font-mono">ngOnInit delay: {{ initDelay }}ms</div>
        <div class="font-mono">Constructor delay: {{ constructorDelay }}ms</div>
        <div class="font-mono">Current count: {{ count() }}</div>
      </div>
    </div>
  `,
})
export class HeavyTimerComponent {
  count = signal(0);
  initDelay = 0;
  constructorDelay = 0;

  constructor() {
    const start = performance.now();
    // Simulate heavy constructor work
    this.heavyComputation(50);
    this.constructorDelay = Math.round(performance.now() - start);
    console.log('[HeavyTimerComponent] Constructor completed');
  }

  ngOnInit() {
    const start = performance.now();
    // Simulate heavy initialization
    this.heavyComputation(100);
    this.initDelay = Math.round(performance.now() - start);
    console.log('[HeavyTimerComponent] ngOnInit completed');

    // Simulate ongoing work
    const interval = setInterval(() => {
      this.count.update(c => c + 1);
    }, 1000);

    effect(() => {
      if (this.count() > 10) {
        clearInterval(interval);
      }
    });
  }

  private heavyComputation(ms: number) {
    const end = performance.now() + ms;
    while (performance.now() < end) {
      // Busy wait to simulate CPU-intensive work
      Math.random() * Math.random();
    }
  }
}