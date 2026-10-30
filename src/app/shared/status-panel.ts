import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-status-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="status-panel" role="status" [attr.aria-busy]="kind() === 'loading'">
      @if (kind() === 'loading') {
        <span class="spinner" aria-hidden="true"></span>
      } @else {
        <span class="status-symbol" aria-hidden="true">{{ kind() === 'error' ? '↻' : '◇' }}</span>
      }
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
      @if (kind() === 'error') {
        <button class="button" (click)="retry.emit()">Try again</button>
      }
    </section>
  `,
})
export class StatusPanel {
  readonly kind = input<'loading' | 'error' | 'empty'>('loading');
  readonly title = input('Finding your next favorite');
  readonly message = input('Just a moment while we get things ready.');
  readonly retry = output<void>();
}
