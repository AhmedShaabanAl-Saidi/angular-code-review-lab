import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="product-card" [class.compact]="options().compact">
      <a
        class="product-art"
        [routerLink]="['/products', product().id]"
        [style.background]="product().color"
      >
        @if (product().originalPrice) {
          <span class="product-tag">Good find</span>
        }
        <img
          [src]="product().image"
          [alt]="product().name"
          loading="lazy"
          width="360"
          height="300"
        />
        <span class="art-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="product-info">
        <div class="product-eyebrow">
          {{ product().category }}
          <span class="rating"><span aria-hidden="true">★</span> {{ product().rating }}</span>
        </div>
        <h3>
          <a [routerLink]="['/products', product().id]">{{ product().name }}</a>
        </h3>
        <div class="product-bottom">
          <p class="price">
            {{ product().price | currency }}
            @if (product().originalPrice) {
              <del>{{ product().originalPrice | currency }}</del>
            }
          </p>
          <button
            class="add-button"
            (click)="add.emit(product())"
            [attr.aria-label]="'Add ' + product().name + ' to cart'"
          >
            +
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly options = input<{ compact: boolean; showRating: boolean }>({
    compact: false,
    showRating: true,
  });
  readonly add = output<Product>();
}
