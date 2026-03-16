import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalEntryService } from './services/journal-entry.service';
import { JournalEntryModalComponent } from './components/journal-entry-modal/journal-entry-modal.component';
import { JournalFilterModalComponent } from './components/journal-filter-modal/journal-filter-modal.component';
import { KeyboardShortcutService } from '../../../core/services/keyboard-shortcut.service';

@Component({
  selector: 'app-journal-entries',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, JournalEntryModalComponent, JournalFilterModalComponent],
  template: `
    <div class="je-page">
      <!-- Header Bar -->
      <div class="je-header">
        <div class="header-title-group">
          <h1 class="page-title">Journal Entries</h1>
          <p class="page-subtitle">Manage, review and validate financial postings</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary action-pill" (click)="importEntries()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </button>
          <button class="btn btn-secondary action-pill" (click)="exportEntries()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button class="btn btn-secondary action-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI Insights
          </button>
          <button class="btn btn-primary action-pill" (click)="openCreateModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Journal Entry
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-row">
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <div class="stat-label">Total This Month</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
          </div>
          <div class="stat-value">{{ svc.stats().totalThisMonth }}</div>
          <div class="stat-sub">+12% vs last month</div>
        </div>
        <div class="stat-card box-shadow-card">
           <div class="stat-header">
             <div class="stat-label">Draft Entries</div>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
           </div>
           <div class="stat-value">{{ svc.stats().draft }}</div>
           <div class="stat-sub text-muted">Pending review</div>
        </div>
        <div class="stat-card box-shadow-card">
           <div class="stat-header">
             <div class="stat-label">Posted Entries</div>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
           </div>
           <div class="stat-value text-success">{{ svc.stats().posted }}</div>
           <div class="stat-sub text-success">Up to date</div>
        </div>
        <div class="stat-card box-shadow-card">
           <div class="stat-header">
             <div class="stat-label">Unbalanced</div>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
           </div>
           <div class="stat-value text-danger">{{ svc.stats().unbalanced }}</div>
           <div class="stat-sub text-danger">Requires attention</div>
        </div>
        <div class="stat-card box-shadow-card">
           <div class="stat-header">
             <div class="stat-label">High Risk</div>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
           </div>
           <div class="stat-value text-warning">{{ svc.stats().highRisk }}</div>
           <div class="stat-sub text-warning">AI flagged</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar box-shadow-card">
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="search-input" placeholder="Try: 'Show entries above 1 lakh posted last month'" [value]="svc.searchQuery()" (input)="onSearch($event)">
        </div>
        <div class="toolbar-actions">
          <select class="action-select">
             <option>All Status</option>
             <option>Draft</option>
             <option>Posted</option>
          </select>
          <select class="action-select">
             <option>This Month</option>
             <option>Last Month</option>
          </select>
          <button class="btn btn-secondary filter-btn" (click)="openFilterModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-container box-shadow-card">
        <table class="je-table">
          <thead>
            <tr>
              <th class="col-docno">DOC NO</th>
              <th class="col-status">STATUS</th>
              <th class="col-date">POSTING DATE</th>
              <th class="col-type">ENTRY TYPE</th>
              <th class="col-amount text-right">DEBIT TOTAL</th>
              <th class="col-amount text-right">CREDIT TOTAL</th>
              <th class="col-bal">BALANCE</th>
              <th class="col-risk">RISK</th>
              <th class="col-user">CREATED BY</th>
              <th class="col-user">VERIFIED BY</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of svc.filteredEntries(); track entry.id) {
              <tr class="table-row">
                <td class="col-docno bold-text">{{ entry.docNo }}</td>
                <td class="col-status">
                  <span class="badge" [class.badge-success]="entry.status === 'Posted'" [class.badge-neutral]="entry.status === 'Draft'">{{ entry.status }}</span>
                </td>
                <td class="col-date">{{ entry.postingDate }}</td>
                <td class="col-type">{{ entry.entryType }}</td>
                <td class="col-amount text-right bold-text">{{ fmtAmt(entry.debitTotal) }}</td>
                <td class="col-amount text-right bold-text">{{ fmtAmt(entry.creditTotal) }}</td>
                <td class="col-bal">
                  <span class="badge" [class.badge-success]="entry.balanceState === 'Balanced'" [class.badge-danger]="entry.balanceState === 'Unbalanced'">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                     {{ entry.balanceState }}
                  </span>
                </td>
                <td class="col-risk">
                  <span class="badge" [class.badge-success]="entry.risk === 'Low'" [class.badge-warning]="entry.risk === 'Medium'" [class.badge-danger]="entry.risk === 'High'">{{ entry.risk }}</span>
                </td>
                <td class="col-user">{{ entry.createdBy }}</td>
                <td class="col-user">{{ entry.verifiedBy || '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      @if (showCreateModal()) {
        <app-journal-entry-modal (close)="closeCreateModal()"></app-journal-entry-modal>
      }

      @if (showFilterModal()) {
        <app-journal-filter-modal (close)="closeFilterModal()"></app-journal-filter-modal>
      }
    </div>
  `,
  styles: [`
    .je-page {
      display: flex; flex-direction: column; flex: 1; min-height: 0; height: 100%;
      overflow: hidden; position: relative;
    }

    /* Header */
    .je-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--space-4) 0 var(--space-3) 0; flex-shrink: 0;
    }
    .page-title { font-size: 20px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); line-height: 1.2; margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 4px; }
    .header-actions { display: flex; align-items: center; gap: var(--space-2); }
    .action-pill {
      border-radius: var(--radius-lg); font-weight: var(--font-weight-medium); padding: 0 16px;
      height: 36px; background: #FFFFFF; border: 1px solid var(--color-border);
      color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px; cursor: pointer;
    }
    .action-pill.btn-primary { background: var(--color-accent); color: #FFFFFF; border: none; }
    .action-pill:not(.btn-primary):hover { background: var(--color-surface-1); }
    .action-pill.btn-primary:hover { filter: brightness(0.95); }

    /* Stats Bar */
    .stats-row {
      display: flex; align-items: stretch; gap: var(--space-3); padding-bottom: var(--space-4); flex-shrink: 0;
    }
    .box-shadow-card {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .stat-card {
      flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: var(--space-1);
    }
    .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;}
    .stat-label { font-size: 12px; color: var(--color-text-primary); font-weight: var(--font-weight-medium); }
    .stat-value { font-size: 24px; font-weight: var(--font-weight-bold); font-variant-numeric: tabular-nums; line-height: 1.1; margin: 4px 0 2px 0;}
    .stat-sub { font-size: 11px; }

    /* Colors */
    .text-success { color: #10B981; }
    .text-danger { color: #EF4444; }
    .text-warning { color: #F59E0B; }
    .text-muted { color: var(--color-text-muted); }

    /* Toolbar */
    .toolbar {
      display: flex; align-items: center; justify-content: space-between; padding: 6px;
      margin-bottom: var(--space-4); flex-shrink: 0; background: #FFFFFF;
    }
    .search-wrap { display: flex; align-items: center; flex: 1; padding: 0 12px; gap: 8px; }
    .search-icon { color: var(--color-text-muted); }
    .search-input { border: none; outline: none; flex: 1; font-size: 13px; color: var(--color-text-primary); }
    .search-input::placeholder { color: var(--color-text-muted); }

    .toolbar-actions { display: flex; align-items: center; gap: 8px; }
    .action-select {
      height: 32px; padding: 0 12px; border: 1px solid transparent; border-radius: var(--radius-md);
      font-size: 13px; color: var(--color-text-primary); background: transparent; cursor: pointer; outline: none;
      font-weight: var(--font-weight-medium); transition: background 0.2s;
    }
    .action-select:hover { background: var(--color-surface-1); }
    .filter-btn {
      height: 32px; padding: 0 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
      font-size: 13px; font-weight: var(--font-weight-medium); background: #FFFFFF;
      display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--color-text-primary);
    }
    .filter-btn:hover { background: var(--color-surface-1); }

    /* Table */
    .table-container {
      flex: 1; min-height: 0; overflow-y: auto; background: #FFFFFF;
    }
    .je-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .je-table th {
      background: #FFFFFF; position: sticky; top: 0; font-size: 10px; font-weight: var(--font-weight-bold);
      color: var(--color-text-secondary); text-transform: uppercase; padding: 12px 16px;
      text-align: left; border-bottom: 1px solid var(--color-border); letter-spacing: 0.05em; z-index: 1;
    }
    .je-table td { padding: 12px 16px; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); white-space: nowrap; }
    .table-row:hover td { background: var(--color-surface-1); cursor: pointer; }
    .text-right { text-align: right !important; }
    .bold-text { font-weight: var(--font-weight-medium); color: #111827; }

    /* Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: var(--font-weight-medium); }
    .badge-success { background: #ECFDF5; color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-neutral { background: var(--color-surface-1); color: var(--color-text-secondary); border: 1px solid var(--color-border); }
    .badge-danger { background: #FEF2F2; color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); }
    .badge-warning { background: #FFFBEB; color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }

    /* Columns Widths */
    .col-docno { width: 140px; }
    .col-status { width: 100px; }
    .col-date { width: 120px; color: var(--color-text-secondary); }
    .col-type { width: 120px; }
    .col-amount { width: 120px; font-variant-numeric: tabular-nums; }
    .col-bal { width: 140px; }
    .col-risk { width: 100px; }
    .col-user { width: 120px; color: var(--color-text-secondary); }
  `]
})
export class JournalEntriesComponent implements OnInit, OnDestroy {
  svc = inject(JournalEntryService);
  private shortcuts = inject(KeyboardShortcutService);

  showCreateModal = signal(false);
  showFilterModal = signal(false);

  private unsubShortcuts: (() => void)[] = [];

  ngOnInit() {
    this.shortcuts.init();
    this.unsubShortcuts = [
      this.shortcuts.register({ key: 'j', ctrl: true, description: 'New Entry', action: () => this.openCreateModal() }),
      this.shortcuts.register({ key: 'f', ctrl: true, description: 'Focus Search', action: () => this.focusSearch() }),
      this.shortcuts.register({ key: 'Escape', description: 'Close modals', action: () => this.handleEscape() }),
    ];
  }

  ngOnDestroy() {
    this.unsubShortcuts.forEach(fn => fn());
    this.shortcuts.destroy();
  }

  onSearch(e: Event) {
    const el = e.target as HTMLInputElement;
    this.svc.setSearchQuery(el.value);
  }

  openCreateModal() { this.showCreateModal.set(true); }
  closeCreateModal() { this.showCreateModal.set(false); }

  openFilterModal() { this.showFilterModal.set(true); }
  closeFilterModal() { this.showFilterModal.set(false); }

  importEntries() {}
  exportEntries() {}

  focusSearch() {
    const el = document.querySelector('.search-input') as HTMLInputElement;
    if (el) el.focus();
  }

  handleEscape() {
    if (this.showCreateModal()) { this.closeCreateModal(); return; }
    if (this.showFilterModal()) { this.closeFilterModal(); return; }
  }

  fmtAmt(num: number): string {
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
