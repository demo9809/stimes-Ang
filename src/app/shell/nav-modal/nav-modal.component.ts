import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject, OnDestroy, HostListener, ElementRef, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SearchResult {
  id: string;
  label: string;
  category: 'navigation' | 'action' | 'create' | 'ai';
  subtitle?: string;
  shortcut?: string;
  route?: string;
}

const SEARCH_DATA: SearchResult[] = [
  { id: 'n-coa', label: 'Chart of Accounts', category: 'navigation', subtitle: 'Accounting', route: '/accounting/chart-of-accounts', shortcut: '↵' },
  { id: 'n-je', label: 'Journal Entries', category: 'navigation', subtitle: 'Accounting', route: '/accounting/journal-entries' },
  { id: 'n-bank', label: 'Banking', category: 'navigation', subtitle: 'Accounting', route: '/banking' },
  { id: 'n-sales', label: 'Sales', category: 'navigation', subtitle: 'Module', route: '/sales' },
  { id: 'n-purchases', label: 'Purchases', category: 'navigation', subtitle: 'Module', route: '/purchases' },
  { id: 'n-reports', label: 'Reports', category: 'navigation', subtitle: 'Module', route: '/reporting' },
  { id: 'c-invoice', label: 'New Sales Invoice', category: 'create', shortcut: '⌘+I' },
  { id: 'c-payment', label: 'New Payment Entry', category: 'create', shortcut: '⌘+P' },
  { id: 'c-journal', label: 'New Journal Entry', category: 'create', shortcut: 'J' },
  { id: 'c-account', label: 'New Account', category: 'create', shortcut: '⌘+N' },
  { id: 'a-receipt', label: 'Receipt Entry', category: 'action', shortcut: 'F6' },
  { id: 'a-credit', label: 'Credit Note', category: 'action', shortcut: 'F11' },
];

@Component({
  selector: 'app-nav-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="close()"></div>
      <div class="nav-modal" role="dialog" aria-modal="true" aria-label="Navigation">
        <!-- Search Input -->
        <div class="search-box">
          <span class="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            #searchInput
            class="search-input"
            type="text"
            placeholder="Search pages, actions, or ask AI..."
            [value]="query()"
            (input)="setQuery($event)"
            (keydown)="handleKey($event)"
            autocomplete="off"
            spellcheck="false"
          />
          <span class="search-esc">Esc</span>
        </div>

        <div class="modal-body">
          @if (!query()) {
            <!-- Default: navigation groups -->
            <div class="result-group">
              <div class="result-group-label">Navigation</div>
              @for (item of navResults(); track item.id; let i = $index) {
                <button
                  class="result-item"
                  [class.highlighted]="highlighted() === i"
                  (click)="execute(item)"
                  (mouseenter)="highlighted.set(i)"
                >
                  <span class="result-icon nav">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                  <span class="result-label">{{ item.label }}</span>
                  @if (item.subtitle) { <span class="result-subtitle">{{ item.subtitle }}</span> }
                  @if (item.shortcut) { <span class="result-shortcut">{{ item.shortcut }}</span> }
                </button>
              }
            </div>

            <div class="result-group">
              <div class="result-group-label">Create</div>
              @for (item of createResults(); track item.id; let i = $index) {
                <button
                  class="result-item"
                  [class.highlighted]="highlighted() === navResults().length + i"
                  (click)="execute(item)"
                  (mouseenter)="highlighted.set(navResults().length + i)"
                >
                  <span class="result-icon create">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                  <span class="result-label">{{ item.label }}</span>
                  @if (item.shortcut) { <span class="result-shortcut">{{ item.shortcut }}</span> }
                </button>
              }
            </div>
          } @else {
            <!-- Search results -->
            @for (item of filteredResults(); track item.id; let i = $index) {
              <button
                class="result-item"
                [class.highlighted]="highlighted() === i"
                (click)="execute(item)"
                (mouseenter)="highlighted.set(i)"
              >
                <span class="result-icon" [class]="item.category">
                  @if (item.category === 'navigation') {
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  } @else if (item.category === 'create') {
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  } @else {
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  }
                </span>
                <span class="result-label">{{ item.label }}</span>
                @if (item.subtitle) { <span class="result-subtitle">{{ item.subtitle }}</span> }
              </button>
            }

            <!-- AI Suggestion -->
            <button class="result-item ai-item" (click)="askAI()">
              <span class="result-icon ai">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <span class="result-label">Ask StimesFi: "{{ query() }}"</span>
              <span class="result-badge">AI Assistant</span>
            </button>
          }
        </div>

        <div class="modal-footer">
          <span class="kbd">↑↓</span> Navigate &nbsp;
          <span class="kbd">↵</span> Select &nbsp;
          <span class="kbd">Esc</span> Close
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: var(--z-overlay);
    }
    .nav-modal {
      position: fixed;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 560px;
      max-width: 95vw;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-float);
      z-index: var(--z-modal);
      overflow: hidden;
    }
    .search-box {
      display: flex;
      align-items: center;
      padding: 0 var(--space-4);
      height: 46px;
      border-bottom: 1px solid var(--color-border);
      gap: var(--space-3);
    }
    .search-icon { color: var(--color-text-muted); display: flex; align-items: center; }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-family: var(--font-family);
      font-size: var(--font-size-md);
      color: var(--color-text-primary);
      background: transparent;
    }
    .search-input::placeholder { color: var(--color-text-placeholder); }
    .search-esc {
      font-size: 10px;
      padding: 2px 6px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text-muted);
    }
    .modal-body { max-height: 380px; overflow-y: auto; padding: var(--space-2) 0; }
    .modal-footer {
      padding: var(--space-2) var(--space-4);
      border-top: 1px solid var(--color-border);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .result-group-label {
      padding: var(--space-1) var(--space-4);
      font-size: 10px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: var(--space-1);
    }
    .result-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      padding: 7px var(--space-4);
      border: none;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      transition: background var(--transition-fast);
    }
    .result-item.highlighted, .result-item:hover { background: var(--color-accent-light); }
    .result-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }
    .result-icon.navigation { background: var(--color-surface-2); color: var(--color-text-muted); }
    .result-icon.create { background: var(--color-success-bg); color: var(--color-success); }
    .result-icon.action { background: var(--color-warning-bg); color: var(--color-warning); }
    .result-icon.ai { background: var(--color-accent-muted); color: var(--color-accent); }
    .result-label { flex: 1; }
    .result-subtitle { font-size: var(--font-size-xs); color: var(--color-text-muted); }
    .result-shortcut { font-size: 10px; padding: 1px 5px; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text-muted); font-family: var(--font-family); }
    .result-badge { font-size: 10px; padding: 2px 6px; background: var(--color-accent-muted); color: var(--color-accent); border-radius: var(--radius-full); font-weight: var(--font-weight-semibold); }
    .ai-item { border-top: 1px solid var(--color-border); margin-top: var(--space-1); }
  `]
})
export class NavModalComponent {
  private router = inject(Router);

  isOpen = signal(false);
  query = signal('');
  highlighted = signal(0);
  onAskAI = output<string>();

  readonly navResults = computed(() => SEARCH_DATA.filter(r => r.category === 'navigation'));
  readonly createResults = computed(() => SEARCH_DATA.filter(r => r.category === 'create'));
  readonly filteredResults = computed(() => {
    const q = this.query().toLowerCase();
    return SEARCH_DATA.filter(r => r.label.toLowerCase().includes(q));
  });

  open(): void {
    this.isOpen.set(true);
    this.query.set('');
    this.highlighted.set(0);
  }

  close(): void {
    this.isOpen.set(false);
  }

  setQuery(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.highlighted.set(0);
  }

  handleKey(e: KeyboardEvent): void {
    const results = this.query() ? this.filteredResults() : [...this.navResults(), ...this.createResults()];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlighted.update(h => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlighted.update(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[this.highlighted()];
      if (item) this.execute(item);
      else if (this.query()) this.askAI();
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  execute(item: SearchResult): void {
    if (item.route) this.router.navigate([item.route]);
    this.close();
  }

  askAI(): void {
    this.onAskAI.emit(this.query());
    this.close();
  }
}
