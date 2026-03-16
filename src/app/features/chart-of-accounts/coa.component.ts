import {
  Component, ChangeDetectionStrategy, inject, signal,
  OnInit, OnDestroy, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from './services/account.service';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { AccountDetailsModalComponent } from './components/account-details-modal/account-details-modal.component';
import { NewAccountModalComponent } from './components/new-account-modal/new-account-modal.component';
import { AiInsightsPopoverComponent } from './components/ai-insights-popover/ai-insights-popover.component';
import { AiChatService } from '../ai-panel/services/ai-chat.service';
import { KeyboardShortcutService } from '../../core/services/keyboard-shortcut.service';
import { Account } from '../../core/models/account.model';

@Component({
  selector: 'app-coa',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    AccountTreeComponent,
    ContextMenuComponent,
    AccountDetailsModalComponent,
    NewAccountModalComponent,
    AiInsightsPopoverComponent,
  ],
  template: `
    <div class="coa-page">
      <!-- Header Bar -->
      <div class="coa-header">
        <div class="header-title-group">
          <h1 class="page-title">Chart of Accounts</h1>
          <p class="page-subtitle">Manage your account hierarchy and posting rules</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary action-pill" (click)="importAccounts()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </button>
          <button class="btn btn-secondary action-pill" (click)="exportAccounts()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button class="btn btn-secondary action-pill" (click)="showInsights.set(!showInsights())">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI Insights
          </button>
          <button class="btn btn-primary action-pill" (click)="openNewAccountModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New
          </button>
        </div>
      </div>

      <!-- Stats Bar (Distinct Cards) -->
      <div class="stats-row">
        @for (stat of stats(); track stat.label) {
          <div class="stat-card box-shadow-card">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value" [class]="stat.colorClass">{{ stat.value }}</div>
          </div>
        }
      </div>

      <!-- Main Content: Tree + Detail Panel -->
      <div class="tree-wrapper" (click)="closeContextMenu()" (keydown.escape)="closeDetailPanel()">
        <app-account-tree
          (accountSelected)="onAccountSelected($event)"
          (contextMenuEvent)="onContextMenu($event)"
        />

        <!-- Context Menu -->
        <app-context-menu
          [visible]="ctxVisible()"
          [x]="ctxX()"
          [y]="ctxY()"
          [account]="ctxAccount()"
          (action)="onContextAction($event)"
          (close)="closeContextMenu()"
        />
      </div>

      <!-- Account Details Modal -->
      @if (selectedAccount(); as acct) {
        <app-account-details-modal
          [account]="acct"
          (close)="closeDetailPanel()"
          (edit)="editAccountAction($event)"
        />
      }

      <!-- New Account Modal -->
      @if (showNewModal()) {
        <app-new-account-modal
          (close)="showNewModal.set(false)"
          (saved)="onAccountSaved($event)"
        />
      }

      <!-- AI Insights Popover -->
      <app-ai-insights-popover
        [visible]="showInsights()"
        (close)="showInsights.set(false)"
      />

      <!-- Toast Notification -->
      @if (toast()) {
        <div class="toast" [class.error]="toast()?.type === 'error'">
          @if (toast()?.type === 'success') {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
          {{ toast()?.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      height: 100%;
      overflow: hidden;
    }
    .coa-page {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Header */
    .coa-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0 var(--space-3) 0;
      flex-shrink: 0;
      background: transparent;
    }
    .page-title {
      font-size: 20px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1.2;
    }
    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-top: 4px;
    }
    .header-actions { display: flex; align-items: center; gap: var(--space-2); }
    .action-pill {
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-medium);
      padding: 0 16px;
      height: 36px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
    }
    .action-pill svg { margin-right: 2px; }
    .action-pill.btn-primary {
      background: var(--color-accent);
      color: #FFFFFF;
      border: none;
    }
    .action-pill:not(.btn-primary):hover {
      background: var(--color-surface-1);
    }

    /* Stats Bar */
    .stats-row {
      display: flex;
      align-items: stretch;
      gap: var(--space-3);
      padding-bottom: var(--space-4);
      flex-shrink: 0;
    }
    .box-shadow-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .stat-card {
      flex: 1;
      padding: 16px var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .stat-label {
      font-size: 11px;
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
    }
    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      font-variant-numeric: tabular-nums;
    }
    /* Let's keep the standard dark colors inside stat values but maybe use the colored classes if we want. In Figma they are black/dark gray. We'll use primary text color. */
    .stat-value { color: var(--color-text-primary); }

    /* Tree Wrapper Background */
    .tree-wrapper {
      flex: 1;
      min-height: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    /* Toast */
    .toast {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 10px 16px;
      background: var(--color-text-primary);
      color: #fff;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999;
      white-space: nowrap;
    }
    .toast.error { background: var(--color-danger); }
  `]
})
export class CoaComponent implements OnInit, OnDestroy {
  accountService = inject(AccountService);
  private aiChat = inject(AiChatService);
  private shortcuts = inject(KeyboardShortcutService);

  // State
  showNewModal = signal(false);
  showInsights = signal(false);
  selectedAccount = signal<Account | null>(null);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  filterQuery = '';

  // Context Menu
  ctxVisible = signal(false);
  ctxX = signal(0);
  ctxY = signal(0);
  ctxAccount = signal<Account | null>(null);

  readonly stats = () => {
    const s = this.accountService.stats();
    return [
      { label: 'Total Assets', value: this.fmt(s.totalAssets), colorClass: 'asset' },
      { label: 'Total Liabilities', value: this.fmt(s.totalLiabilities), colorClass: 'liability' },
      { label: 'Total Equity', value: this.fmt(s.totalEquity), colorClass: 'equity' },
      { label: 'Total Income', value: this.fmt(s.totalIncome), colorClass: 'income' },
      { label: 'Total Expenses', value: this.fmt(s.totalExpenses), colorClass: 'expense' },
    ];
  };

  private unsubShortcuts: (() => void)[] = [];

  ngOnInit(): void {
    this.shortcuts.init();
    this.unsubShortcuts = [
      this.shortcuts.register({ key: 'n', ctrl: true, description: 'New Account', action: () => this.openNewAccountModal() }),
      this.shortcuts.register({ key: 'Escape', description: 'Close panels', action: () => this.handleEscape() }),
      this.shortcuts.register({ key: 'Delete', description: 'Delete selected', action: () => this.deleteSelected() }),
    ];
  }

  ngOnDestroy(): void {
    this.unsubShortcuts.forEach(fn => fn());
    this.shortcuts.destroy();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeContextMenu();
  }

  openNewAccountModal(): void { this.showNewModal.set(true); }

  onAccountSelected(account: Account): void {
    this.selectedAccount.update(prev => prev?.id === account.id ? null : account);
  }

  closeDetailPanel(): void {
    this.selectedAccount.set(null);
    this.accountService.selectAccount(null);
  }

  onContextMenu(data: { event: MouseEvent; account: Account }): void {
    data.event.preventDefault();
    data.event.stopPropagation();
    const margin = 8;
    const menuW = 190;
    const menuH = 200;
    let x = data.event.clientX;
    let y = data.event.clientY;
    if (x + menuW > window.innerWidth - margin) x = x - menuW;
    if (y + menuH > window.innerHeight - margin) y = y - menuH;
    this.ctxX.set(x);
    this.ctxY.set(y);
    this.ctxAccount.set(data.account);
    this.ctxVisible.set(true);
  }

  closeContextMenu(): void { this.ctxVisible.set(false); }

  onContextAction(data: { actionId: string; account: Account }): void {
    switch (data.actionId) {
      case 'edit':
        this.selectedAccount.set(data.account);
        break;
      case 'add-account':
      case 'add-group':
        this.openNewAccountModal();
        break;
      case 'delete':
        this.confirmDelete(data.account);
        break;
      case 'disable':
        this.accountService.disableAccount(data.account.id);
        this.showToast(`Account "${data.account.name}" disabled`);
        break;
    }
  }

  onAccountSaved(account: Account): void {
    this.showToast(`Account "${account.name}" created successfully`);
  }

  editAccountAction(account: Account): void {
    this.selectedAccount.set(account);
  }

  importAccounts(): void {
    this.showToast('Import feature coming soon');
  }

  exportAccounts(): void {
    this.showToast('Export feature coming soon');
  }

  private handleEscape(): void {
    if (this.ctxVisible()) { this.closeContextMenu(); return; }
    if (this.showNewModal()) { this.showNewModal.set(false); return; }
    if (this.showInsights()) { this.showInsights.set(false); return; }
    if (this.selectedAccount()) { this.closeDetailPanel(); return; }
  }

  private deleteSelected(): void {
    const acct = this.selectedAccount();
    if (!acct) return;
    this.confirmDelete(acct);
  }

  private confirmDelete(account: Account): void {
    if (account.children.length > 0) {
      this.showToast('Cannot delete account with sub-accounts. Remove sub-accounts first.', 'error');
      return;
    }
    if (confirm(`Delete account "${account.name}" (${account.code})? This cannot be undone.`)) {
      this.accountService.deleteAccount(account.id);
      this.closeDetailPanel();
      this.showToast(`Account "${account.name}" deleted`);
    }
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }

  private fmt(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  }
}
