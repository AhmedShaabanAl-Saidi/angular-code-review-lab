import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-delivery-note',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="delivery-note">
    <span aria-hidden="true">♧</span>
    <div>
      <strong>{{ delivery().title }}</strong>
      <p>{{ delivery().message }}</p>
    </div>
  </div>`,
})
export class DeliveryNote {
  readonly delivery = input.required<{ title: string; message: string }>();
}
