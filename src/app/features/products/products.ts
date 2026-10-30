import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, DoCheck, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogApi } from '../../core/catalog-api';
import { CartStore } from '../../core/cart-store';
import { Product, readScenario } from '../../core/models';
import { ProductCard } from '../../shared/product-card';
import { StatusPanel } from '../../shared/status-panel';
import { Pagination } from '../../shared/pagination';

@Component({
  imports: [ReactiveFormsModule, AsyncPipe, CurrencyPipe, ProductCard, StatusPanel, Pagination],
  templateUrl: './products.html',
})
export class ProductsPage implements DoCheck {
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly view = inject(ChangeDetectorRef);
  readonly cart = inject(CartStore);
  products: Product[] = [];
  catalog$: Observable<Product[]> = of([]);
  loading = true;
  error = false;
  readonly page = signal(1);
  readonly pageSize = 24;
  notice = '';
  activeFilters: string[] = [];
  readonly categories = ['All', 'Audio', 'Home', 'Everyday', 'Workspace'];
  readonly form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    category: new FormControl('All', { nonNullable: true }),
    maxPrice: new FormControl('500', { nonNullable: true }),
    sort: new FormControl('featured', { nonNullable: true }),
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.form.controls.category.setValue(
        this.categories.includes(params.get('category') ?? '') ? params.get('category')! : 'All',
      );
      this.load();
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.page.set(1);
      this.view.markForCheck();
    });
  }

  ngDoCheck(): void {
    this.activeFilters = [
      this.form.controls.search.value,
      this.form.controls.category.value,
    ].filter((value) => value !== '' && value !== 'All');
  }

  load(): void {
    this.page.set(1);
    this.loading = true;
    this.error = false;
    this.view.markForCheck();
    const request = this.api.products(
      readScenario(this.route.snapshot.queryParamMap.get('scenario')),
    );
    this.catalog$ = request.pipe(catchError(() => of([])));
    request.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.view.markForCheck();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.view.markForCheck();
      },
    });
  }

  retry(): void {
    this.page.set(1);
    this.loading = true;
    this.view.markForCheck();
    this.api.products().subscribe({
      next: (products) => {
        this.products = products;
        this.error = false;
        this.loading = false;
        this.view.markForCheck();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.view.markForCheck();
      },
    });
  }

  getFilteredProducts(): Product[] {
    const values = this.form.getRawValue();
    const search = values.search.trim().toLowerCase();
    const results = this.products.filter(
      (product) =>
        (product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)) &&
        (values.category === 'All' || product.category === values.category) &&
        product.price <= Number(values.maxPrice),
    );
    return results.sort((a, b) =>
      values.sort === 'price-asc'
        ? a.price - b.price
        : values.sort === 'price-desc'
          ? b.price - a.price
          : values.sort === 'rating'
            ? b.rating - a.rating
            : Number(b.featured) - Number(a.featured) || a.id - b.id,
    );
  }

  getCollectionValue(): number {
    return this.getFilteredProducts().reduce((sum, product) => sum + product.price, 0);
  }

  get pagedProducts(): Product[] {
    const start = (this.page() - 1) * this.pageSize;
    return this.getFilteredProducts().slice(start, start + this.pageSize);
  }

  reset(): void {
    this.form.reset({ search: '', category: 'All', maxPrice: '500', sort: 'featured' });
  }
  add(product: Product): void {
    this.cart.add(product);
    this.notice = product.name + ' added to your bag.';
  }
}
