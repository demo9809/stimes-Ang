import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, ACCOUNT_TYPE_CSS } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-details-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="details-modal" role="dialog" aria-modal="true">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <button class="btn btn-ghost btn-icon back-btn" (click)="close.emit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <div class="account-title-area">
              <h2 class="account-name">{{ account().name }} <span class="account-code">({{ account().code }})</span></h2>
              <span class="badge" [ngClass]="typeClass(account().type)">{{ account().type }}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="btn btn-secondary" (click)="edit.emit(account())">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/>
              </svg>
              Edit Account
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs-header">
            <button class="tab-btn" [class.active]="activeTab() === 'activity'" (click)="activeTab.set('activity')">Activity & Balance</button>
            <button class="tab-btn" [class.active]="activeTab() === 'details'" (click)="activeTab.set('details')">Account Details</button>
          </div>

          <div class="tab-content scrollable">
            @if (activeTab() === 'activity') {
              <!-- Stats Cards -->
              <div class="stats-row">
                <div class="stat-card">
                  <div class="stat-title">Total Balance</div>
                  <div class="stat-val balance">$124,500.00</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">Total Debit</div>
                  <div class="stat-val debit">$45,200.00</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">Total Credit</div>
                  <div class="stat-val credit">$169,700.00</div>
                </div>
              </div>

              <!-- Transactions Table -->
              <div class="tx-section">
                <div class="tx-header">
                  <h3 class="section-title">Recent Transactions</h3>
                  <button class="btn btn-ghost btn-sm">View All</button>
                </div>
                <div class="table-container">
                  <table class="tx-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Ref#</th>
                        <th class="text-right">Debit</th>
                        <th class="text-right">Credit</th>
                        <th class="text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>10 Oct 2023</td>
                        <td>Opening Balance</td>
                        <td>-</td>
                        <td class="text-right">-</td>
                        <td class="text-right">$100,000.00</td>
                        <td class="text-right">$100,000.00</td>
                      </tr>
                      <tr>
                        <td>12 Oct 2023</td>
                        <td>Invoice #INV-2023-001</td>
                        <td>INV-001</td>
                        <td class="text-right">$14,500.00</td>
                        <td class="text-right">-</td>
                        <td class="text-right">$114,500.00</td>
                      </tr>
                      <tr>
                        <td>15 Oct 2023</td>
                        <td>Payment Received</td>
                        <td>RCP-042</td>
                        <td class="text-right">-</td>
                        <td class="text-right">$5,000.00</td>
                        <td class="text-right">$109,500.00</td>
                      </tr>
                      <tr>
                        <td>18 Oct 2023</td>
                        <td>Invoice #INV-2023-002</td>
                        <td>INV-002</td>
                        <td class="text-right">$15,000.00</td>
                        <td class="text-right">-</td>
                        <td class="text-right">$124,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            } @else {
              <!-- Account Details Tab -->
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Account Name</span>
                  <span class="detail-value">{{ account().name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Account Code</span>
                  <span class="detail-value">{{ account().code }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Account Group</span>
                  <span class="detail-value">{{ account().accountGroup || 'None' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Parent Account</span>
                  <span class="detail-value">{{ account().parentId || 'Root Level' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Currency</span>
                  <span class="detail-value">{{ account().currency || 'USD' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Intercompany</span>
                  <span class="detail-value">{{ account().isIntercompany ? ('Yes (' + account().intercompanyAccount + ')') : 'No' }}</span>
                </div>
                <div class="detail-item full-width">
                  <span class="detail-label">Description</span>
                  <span class="detail-value">{{ account().description || '-' }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4); /* darker slate backdrop */
      backdrop-filter: blur(2px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .details-modal {
      width: 800px;
      max-width: 95vw;
      height: 600px;
      max-height: 90vh;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .back-btn { margin-left: -8px; color: var(--color-text-secondary); }
    .back-btn:hover { color: var(--color-text-primary); }

    .account-title-area { display: flex; align-items: center; gap: 12px; }
    .account-name { font-size: 20px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); margin: 0; display: flex; align-items:center; gap: 6px;}
    .account-code { color: var(--color-text-muted); font-weight: var(--font-weight-normal); }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: var(--font-weight-semibold); text-transform: uppercase; }

    /* Using type classes from tokens or standard ones */
    .badge-asset { background: var(--color-asset-light, #ecfdf5); color: var(--color-asset, #059669); }
    .badge-liability { background: var(--color-liability-light, #fef2f2); color: var(--color-liability, #dc2626); }
    .badge-equity { background: var(--color-equity-light, #f5f3ff); color: var(--color-equity, #c026d3); }
    .badge-income { background: var(--color-income-light, #eff6ff); color: var(--color-income, #2563eb); }
    .badge-expense { background: var(--color-expense-light, #fffbeb); color: var(--color-expense, #d97706); }

    .modal-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #FAFAFA; }

    /* Tabs */
    .tabs-header {
      display: flex;
      gap: 24px;
      padding: 0 24px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }
    .tab-btn {
      background: none; border: none;
      padding: 12px 0;
      font-size: 14px;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    }
    .tab-btn:hover { color: var(--color-text-primary); }
    .tab-btn.active { color: var(--color-accent); border-bottom-color: var(--color-accent); }

    .tab-content { padding: 24px; flex: 1; overflow-y: auto; }

    /* Stats */
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card {
      background: var(--color-surface);
      padding: 16px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .stat-title { font-size: 12px; color: var(--color-text-secondary); font-weight: var(--font-weight-medium); margin-bottom: 8px; }
    .stat-val { font-size: 24px; font-weight: var(--font-weight-bold); }
    .stat-val.balance { color: var(--color-accent); }
    .stat-val.debit { color: var(--color-danger); }
    .stat-val.credit { color: var(--color-success); }

    /* Table */
    .tx-section { background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); overflow: hidden; }
    .tx-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid var(--color-border); }
    .section-title { font-size: 14px; font-weight: var(--font-weight-semibold); margin: 0; }
    .table-container { overflow-x: auto; }
    .tx-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .tx-table th, .tx-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); }
    .tx-table th { color: var(--color-text-muted); font-weight: var(--font-weight-medium); }
    .tx-table td { color: var(--color-text-primary); }
    .text-right { text-align: right !important; }

    /* Details Grid */
    .details-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      background: var(--color-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--color-border);
    }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .full-width { grid-column: 1 / -1; }
    .detail-label { font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: var(--font-weight-bold); }
    .detail-value { font-size: 14px; color: var(--color-text-primary); }
  `]
})
export class AccountDetailsModalComponent {
  account = input.required<Account>();
  close = output<void>();
  edit = output<Account>();

  activeTab = signal<'activity'|'details'>('activity');

  typeClass(type: string): string {
    return ACCOUNT_TYPE_CSS[type as keyof typeof ACCOUNT_TYPE_CSS] || 'badge-expense';
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
