import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from './services/payment.service';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="payments-page">
      <!-- Header Bar -->
      <div class="page-header">
        <div class="header-title-group">
          <h1 class="page-title">Payments</h1>
          <p class="page-subtitle">Manage all payment transactions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary action-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </button>
          <button class="btn btn-secondary action-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button class="btn btn-primary action-pill" (click)="openCreatePayment()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Payment
          </button>
        </div>
      </div>

      <!-- Stats Bar (Distinct Cards) -->
      <div class="stats-row">
        <!-- Total Payments -->
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <span class="stat-label">Total Payments</span>
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="stat-value">₹{{ service.stats().totalPayments | number:'1.0-0' }}</div>
          <div class="stat-subtext text-success">+{{ service.stats().totalPaymentsPercentage }}% vs last month</div>
        </div>

        <!-- Approved -->
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <span class="stat-label">Approved</span>
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-value">{{ service.stats().approvedCount }}</div>
          <div class="stat-subtext">{{ service.stats().approvedTotal }} total entries</div>
        </div>

        <!-- Pending -->
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <span class="stat-label">Pending</span>
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="stat-value">{{ service.stats().pendingCount }}</div>
          <div class="stat-subtext text-warning">Awaiting approval</div>
        </div>

        <!-- Bank Payments -->
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <span class="stat-label">Bank Payments</span>
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-liability)" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div class="stat-value">₹{{ service.stats().bankPaymentsAmount | number:'1.0-0' }}</div>
          <div class="stat-subtext">{{ service.stats().bankPaymentsPercentage }}% of total</div>
        </div>

        <!-- Cash Payments -->
        <div class="stat-card box-shadow-card">
          <div class="stat-header">
            <span class="stat-label">Cash Payments</span>
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-value">₹{{ service.stats().cashPaymentsAmount | number:'1.0-0' }}</div>
          <div class="stat-subtext">{{ service.stats().cashPaymentsPercentage }}% of total</div>
        </div>
      </div>

      <!-- Filters & Table Wrapper -->
      <div class="table-wrapper box-shadow-card">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="form-input search-input" placeholder="Try: 'Show payments above 50k to suppliers'">
          </div>
          <div class="filter-actions">
            <select class="form-select status-select">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>
            <select class="form-select date-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Custom Range</option>
            </select>
            <button class="btn btn-secondary filter-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filters
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-docno">DOC NO</th>
                <th class="col-status">STATUS</th>
                <th class="col-date">BOOK DATE</th>
                <th class="col-date">POSTED DATE</th>
                <th class="col-party">PARTY NAME</th>
                <th class="col-type">PARTY TYPE</th>
                <th class="col-amount">AMOUNT</th>
                <th class="col-mode">PAYMENT MODE</th>
                <th class="col-bank">BANK ACCOUNT</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of service.payments(); track payment.id) {
                <tr>
                  <td class="col-docno fw-medium">{{ payment.docNo }}</td>
                  <td class="col-status">
                    <span class="badge" 
                      [class.badge-posting]="payment.status === 'Approved'"
                      [class.badge-warning]="payment.status === 'Pending'"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="col-date">{{ payment.bookDate }}</td>
                  <td class="col-date">{{ payment.postedDate }}</td>
                  <td class="col-party">{{ payment.partyName }}</td>
                  <td class="col-type">{{ payment.partyType }}</td>
                  <td class="col-amount fw-bold text-right">₹{{ payment.amount | number:'1.0-0' }}</td>
                  <td class="col-mode">
                    <span class="badge badge-mode"
                      [class.badge-cash]="payment.paymentMode === 'Cash'"
                      [class.badge-bank]="payment.paymentMode === 'Bank'"
                      [class.badge-cheque]="payment.paymentMode === 'Cheque'"
                    >
                      {{ payment.paymentMode }}
                    </span>
                  </td>
                  <td class="col-bank">{{ payment.bankAccount }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
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
    .payments-page {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Header */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0 var(--space-4) 0;
      flex-shrink: 0;
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
    .action-pill svg { margin-right: 4px; }
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
      justify-content: space-between;
      gap: 8px;
    }
    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-label {
      font-size: 11px;
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.02em;
    }
    .stat-icon {
      width: 14px;
      height: 14px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1.1;
    }
    .stat-subtext {
      font-size: 11px;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
    }
    .text-success { color: var(--color-success); }
    .text-warning { color: var(--color-warning); font-weight: var(--font-weight-bold); }

    /* Table Wrapper & Filter Bar */
    .table-wrapper {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      flex-shrink: 0;
    }
    .search-box {
      flex: 1;
      max-width: 480px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-box svg {
      position: absolute;
      left: 12px;
      color: var(--color-text-muted);
    }
    .search-input {
      padding-left: 36px;
      background: var(--color-surface-1);
      border-color: transparent;
      height: 36px;
    }
    .search-input:focus {
      background: var(--color-surface);
      border-color: var(--color-border);
      box-shadow: none;
    }
    .filter-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .status-select, .date-select {
      height: 36px;
      font-size: 12px;
      font-weight: var(--font-weight-medium);
      min-width: 130px;
    }
    .filter-btn {
      height: 36px;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }
    .filter-btn svg { margin-right: 4px; }

    /* Data Table */
    .table-container {
      flex: 1;
      overflow: auto;
      background: var(--color-surface);
    }
    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 12px;
    }
    .data-table th {
      position: sticky;
      top: 0;
      background: var(--color-surface);
      z-index: 10;
      text-align: left;
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-border);
    }
    .data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-surface-2);
      color: var(--color-text-secondary);
    }
    .data-table tbody tr:hover td {
      background: var(--color-surface-1);
    }
    
    .fw-medium { font-weight: var(--font-weight-medium); color: var(--color-text-primary); }
    .fw-bold { font-weight: var(--font-weight-bold); color: var(--color-text-primary); }
    .text-right { text-align: right; }
    
    .col-docno { width: 100px; }
    .col-status { width: 100px; }
    .col-date { width: 100px; }
    .col-party { min-width: 180px; }
    .col-type { width: 100px; }
    .col-amount { width: 110px; text-align: right; }
    .col-mode { width: 120px; text-align: center; }
    .data-table th.col-mode { text-align: center; }
    .col-bank { width: 100px; }

    /* Custom Badges */
    .badge-warning {
      background: var(--color-warning-bg);
      color: var(--color-warning);
      border: 1px solid var(--color-warning-border);
    }
    .badge-mode {
      border: 1px solid var(--color-border);
      background: transparent;
      padding: 2px 8px;
    }
    .badge-cash { color: var(--color-accent); border-color: var(--color-accent-muted); background: var(--color-asset-bg); }
    .badge-bank { color: var(--color-liability); border-color: var(--color-liability-bg); background: var(--color-liability-bg); }
    .badge-cheque { color: var(--color-success); border-color: var(--color-success-bg); background: var(--color-success-bg); }
  `]
})
export class PaymentsComponent implements OnInit {
  service = inject(PaymentService);

  ngOnInit() {
    // Initial fetch/setup if required
  }

  openCreatePayment() {
    this.service.togglePaymentModal(true);
  }
}
