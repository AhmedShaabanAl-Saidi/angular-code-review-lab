import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../core/cart-store';
import { DeliveryNote } from '../../shared/delivery-note';

@Component({
  imports: [CurrencyPipe, RouterLink, DeliveryNote],
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CartPage {
  readonly cart = inject(CartStore);
  // TODO 6
  readonly SHIPPING_COST = 5.99;
  delivery = {
    title: 'A thoughtful arrival',
    message: 'Your items arrive in our signature recyclable packaging.',
  };
  gift = false;

  getSubtotal(): number {
    return (
      this.cart
        .items()
        .reduce((sum, item) => sum + Math.round(item.product.price * 100) * item.quantity, 0) / 100
    );
  }
  getShipping(): number {
    return this.cart.count() === 0 || this.getSubtotal() >= 100 ? 0 : this.SHIPPING_COST;
  }
  getTotal(): number {
    return Math.round((this.getSubtotal() + this.getShipping()) * 100) / 100;
  }
  updateQuantity(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cart.update(id, Number(input.value));
    input.value = String(this.cart.items().find((item) => item.product.id === id)?.quantity ?? 1);
  }
  setGift(event: Event): void {
    this.gift = (event.target as HTMLInputElement).checked;
    this.delivery.message = this.gift
      ? 'Your gift arrives wrapped, with a blank note card. No extra charge.'
      : 'Your items arrive in our signature recyclable packaging.';
  }
}
