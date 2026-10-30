import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { CatalogApi } from '../../core/catalog-api';
import { CartStore } from '../../core/cart-store';
import { Product, readScenario } from '../../core/models';
import { StatusPanel } from '../../shared/status-panel';

@Component({
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule, StatusPanel],
  templateUrl: './product-details.html',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CatalogApi);
  readonly cart = inject(CartStore);
  readonly state = signal<{ loading: boolean; error: boolean; product: Product | null }>({
    loading: true,
    error: false,
    product: null,
  });
  readonly product = computed(() => this.state().product);
  readonly quantity = new FormControl(1, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
      Validators.pattern(/^[0-9]+$/),
    ],
  });
  readonly message = signal('');

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        switchMap(([params, query]) =>
          this.api.products(readScenario(query.get('scenario'))).pipe(
            map((products) => ({
              loading: false,
              error: false,
              product: products.find((product) => product.id === Number(params.get('id'))) ?? null,
            })),
            catchError(() => of({ loading: false, error: true, product: null })),
            startWith({ loading: true, error: false, product: null }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((state) => {
        this.state.set(state);
        this.message.set('');
      });
  }

  retry(): void {
    this.state.set({ loading: true, error: false, product: null });
    this.api.products().subscribe({
      next: (products) =>
        this.state.set({
          loading: false,
          error: false,
          product:
            products.find(
              (product) => product.id === Number(this.route.snapshot.paramMap.get('id')),
            ) ?? null,
        }),
      error: () => this.state.set({ loading: false, error: true, product: null }),
    });
  }

  add(): void {
    const product = this.product();
    if (!product || this.quantity.invalid) {
      this.quantity.markAsTouched();
      return;
    }
    this.cart.add(product, this.quantity.value);
    this.message.set('A good choice. Added to your bag.');
  }
}
