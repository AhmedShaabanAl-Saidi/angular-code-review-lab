import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from './models';

const STORAGE_KEY = 'morrow.cart.v1';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly entries = signal<CartItem[]>(this.restore());
  readonly items = this.entries.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(
    () =>
      Math.round(
        this.items().reduce(
          (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
          0,
        ),
      ) / 100,
  );
  // TODO 6
  readonly shipping = computed(() => (this.count() === 0 || this.subtotal() >= 100 ? 0 : 5.99));
  readonly total = computed(() => Math.round((this.subtotal() + this.shipping()) * 100) / 100);

  add(product: Product, quantity = 1): void {
    if (!Number.isFinite(quantity)) return;
    this.entries.update((items) => {
      const current = items.find((item) => item.product.id === product.id);
      const amount = Math.min(99, Math.max(1, Math.trunc(quantity)));
      return current
        ? items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(99, item.quantity + amount) }
            : item,
        )
        : [...items, { product, quantity: amount }];
    });
    this.save();
  }

  update(id: number, quantity: number): void {
    if (!Number.isFinite(quantity)) return;
    const amount = Math.min(99, Math.max(1, Math.trunc(quantity)));
    this.entries.update((items) =>
      items.map((item) => (item.product.id === id ? { ...item, quantity: amount } : item)),
    );
    this.save();
  }

  remove(id: number): void {
    this.entries.update((items) => items.filter((item) => item.product.id !== id));
    this.save();
  }

  private restore(): CartItem[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(stored)) return [];
      return stored.filter((item): item is CartItem => {
        if (!item || typeof item !== 'object') return false;
        const entry = item as Partial<CartItem>;
        return (
          Number.isInteger(entry.quantity) &&
          entry.quantity! >= 1 &&
          entry.quantity! <= 99 &&
          !!entry.product &&
          Number.isInteger(entry.product.id) &&
          typeof entry.product.name === 'string' &&
          typeof entry.product.image === 'string' &&
          Number.isFinite(entry.product.price) &&
          entry.product.price >= 0
        );
      });
    } catch {
      return [];
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
      /* The current cart remains available when storage is unavailable. */
    }
  }
}
