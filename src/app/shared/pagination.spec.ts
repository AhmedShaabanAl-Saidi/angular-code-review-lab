import { TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Pagination] }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  function render(totalItems: number, page = 1, pageSize = 20) {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('totalItems', totalItems);
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('pageSize', pageSize);
    fixture.detectChanges();
    return fixture;
  }

  it.each([
    { total: 0, summary: 'Showing 0–0 of 0 items' },
    { total: 12, summary: 'Showing 1–12 of 12 items' },
  ])('shows the correct range and hides navigation for $total items', ({ total, summary }) => {
    const fixture = render(total);
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.pagination-summary')?.textContent?.trim()).toBe(summary);
    expect(element.querySelector('button')).toBeNull();
  });

  it('shows a partial last page and emits previous and next selections', () => {
    const fixture = render(45, 3);
    const element = fixture.nativeElement as HTMLElement;
    const change = vi.fn();
    fixture.componentInstance.pageChange.subscribe(change);
    expect(element.querySelector('.pagination-summary')?.textContent).toContain('41–45 of 45');
    expect(element.querySelector<HTMLButtonElement>('[aria-label="Next page"]')?.disabled).toBe(
      true,
    );
    element.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')!.click();
    expect(change).toHaveBeenLastCalledWith(2);
    fixture.componentRef.setInput('page', 2);
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.click();
    expect(change).toHaveBeenLastCalledWith(3);
  });

  it('keeps long lists compact while allowing navigation to the last page', () => {
    const fixture = render(1000, 25);
    const element = fixture.nativeElement as HTMLElement;
    const change = vi.fn();
    fixture.componentInstance.pageChange.subscribe(change);
    expect(element.querySelectorAll('[aria-label^="Go to page"]')).toHaveLength(5);
    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('25');
    element.querySelector<HTMLButtonElement>('[aria-label="Go to page 50"]')!.click();
    expect(change).toHaveBeenCalledWith(50);
  });

  it('keeps its displayed range valid when the result count shrinks', () => {
    const fixture = render(120, 6);
    fixture.componentRef.setInput('totalItems', 31);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.pagination-summary')?.textContent).toContain('21–31 of 31');
    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2');
    expect(element.querySelector<HTMLButtonElement>('[aria-label="Next page"]')?.disabled).toBe(
      true,
    );
  });

  it('does not emit a selection for the disabled previous button or current page', () => {
    const fixture = render(40);
    const element = fixture.nativeElement as HTMLElement;
    const change = vi.fn();
    fixture.componentInstance.pageChange.subscribe(change);
    element.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')!.click();
    element.querySelector<HTMLButtonElement>('[aria-label="Go to page 1"]')!.click();
    expect(change).not.toHaveBeenCalled();
  });
});
