import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CatalogApi } from '../../core/catalog-api';
import { CartStore } from '../../core/cart-store';
import { Product, readScenario } from '../../core/models';
import { ProductCard } from '../../shared/product-card';
import { StatusPanel } from '../../shared/status-panel';

@Component({
  imports: [RouterLink, ProductCard, StatusPanel],
  templateUrl: './home.html',
})
export class HomePage {
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  readonly cart = inject(CartStore);
  readonly state = signal<{ loading: boolean; error: boolean; products: Product[] }>({
    loading: true,
    error: false,
    products: [],
  });
  readonly featured = computed(() =>
    this.state()
      .products.filter((product) => product.featured)
      .slice(0, 4),
  );
  readonly added = signal('');
  readonly categories = [
    { name: 'Audio', caption: 'Find your rhythm', image: '/art/audio.svg', color: '#ede9e2' },
    {
      name: 'Home',
      caption: 'Make room for good things',
      image: '/art/home.svg',
      color: '#e7ede5',
    },
    {
      name: 'Everyday',
      caption: 'Go a little further',
      image: '/art/everyday.svg',
      color: '#eee2d6',
    },
    {
      name: 'Workspace',
      caption: 'A fresh perspective',
      image: '/art/workspace.svg',
      color: '#e5e7ee',
    },
  ];

  constructor() {
    this.route.queryParamMap
      .pipe(
        switchMap((params) =>
          this.api.products(readScenario(params.get('scenario'))).pipe(
            map((products) => ({ loading: false, error: false, products })),
            catchError(() => of({ loading: false, error: true, products: [] as Product[] })),
            startWith({ loading: true, error: false, products: [] as Product[] }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((state) => this.state.set(state));
  }

  add(product: Product): void {
    this.cart.add(product);
    this.added.set(product.name + ' added to your bag.');
  }
  retry(): void {
    this.state.set({ loading: true, error: false, products: [] });
    this.api.products().subscribe({
      next: (products) => this.state.set({ loading: false, error: false, products }),
      error: () => this.state.set({ loading: false, error: true, products: [] }),
    });
  }
}
