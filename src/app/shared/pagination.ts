import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly totalItems = input.required<number>();
  readonly page = input(1);
  readonly pageSize = input(20);
  readonly itemLabel = input('items');
  readonly pageChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  readonly currentPage = computed(() => Math.min(Math.max(1, this.page()), this.totalPages()));
  readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );
  readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );
  readonly pages = computed(() => {
    const total = this.totalPages();
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    const current = this.currentPage();
    const start = Math.max(2, Math.min(current - 1, total - 3));
    const end = Math.min(total - 1, Math.max(current + 1, 4));
    const pages: (number | 'start-gap' | 'end-gap')[] = [1];
    if (start > 2) pages.push('start-gap');
    for (let page = start; page <= end; page++) pages.push(page);
    if (end < total - 1) pages.push('end-gap');
    pages.push(total);
    return pages;
  });

  select(page: number | string): void {
    if (typeof page !== 'number') return;
    const next = Math.min(Math.max(1, page), this.totalPages());
    if (next !== this.currentPage()) this.pageChange.emit(next);
  }
}
