import { Component, ChangeDetectionStrategy, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ModalAiPanelComponent } from '../../../../ai-panel/components/modal-ai-panel/modal-ai-panel.component';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, ModalAiPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Overlay backdrop -->
    <div class="overlay-backdrop" (click)="close()"></div>

    <!-- Modal Container -->
    <div class="modal-container box-shadow-float" [class.ai-expanded]="isAiExpanded()" [class.fullscreen]="isFullscreen()">
      
      <!-- Main Modal Content -->
      <div class="modal-content-wrapper">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <div class="icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Payment #1</h2>
              <div class="modal-subtitle">
                Ctrl+S Save · Ctrl+Enter Save & New · F11 Maximize
              </div>
            </div>
          </div>
          <div class="header-right">
            <button class="btn btn-ghost btn-icon" (click)="toggleFullscreen()" title="Maximize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <button class="btn btn-secondary stimes-fi-pill" [class.active]="isAiExpanded()" (click)="toggleAiPanel()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Stimes Fi
            </button>
            <button class="btn btn-ghost btn-icon close-btn" (click)="close()" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Top Row Form Fields -->
          <div class="form-row grid-4">
            <div class="form-field">
              <label class="form-label required">DOC SERIES</label>
              <select class="form-select" [(ngModel)]="docSeries">
                <option value="SPXXXX">SPXXXX</option>
                <option value="SP001">SP001</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label required">PARTY TYPE</label>
              <select class="form-select" [(ngModel)]="partyType">
                <option value="">Select Type</option>
                <option value="Supplier">Supplier</option>
                <option value="Customer">Customer</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label required">PARTY</label>
              <select class="form-select" [(ngModel)]="selectedParty" (ngModelChange)="onPartySelected($event)">
                <option value="">Select Party</option>
                <option value="acme">Acme Suppliers Ltd</option>
                <option value="tech">Tech Supplies Inc</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label required">BOOK DATE</label>
              <input type="date" class="form-input" [(ngModel)]="bookDate">
            </div>
          </div>

          <!-- Progressive Expansion: Only show if a party is selected -->
          @if (selectedParty()) {
            <div class="progressive-content section-animate-in">
              <!-- Outstanding Banner -->
              <div class="info-banner mt-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="info-text">Total Outstanding:</span>
                <span class="info-amount">₹370.00</span>
              </div>

              <!-- Invoice Allocation -->
              <div class="section-title mt-6">
                <h3>Invoice Allocation</h3>
                <span class="section-badge">2 pending invoice(s)</span>
              </div>
              <div class="table-container inline-table bb-none">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th class="col-inv">INVOICE #</th>
                      <th class="col-date">BOOK DATE</th>
                      <th class="col-date">DUE DATE</th>
                      <th class="col-amount text-right">DUE AMOUNT</th>
                      <th class="col-payment text-right">PAYMENT</th>
                      <th class="col-status">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (inv of invoices(); track inv.id) {
                      <tr>
                        <td class="col-inv text-accent fw-medium">{{ inv.invoiceNo }}</td>
                        <td class="col-date">{{ inv.bookDate }}</td>
                        <td class="col-date">{{ inv.dueDate }}</td>
                        <td class="col-amount text-right fw-bold">₹{{ inv.dueAmount | number:'1.2-2' }}</td>
                        <td class="col-payment">
                          <input type="number" class="form-input text-right amount-input" [(ngModel)]="inv.paymentAmount" (ngModelChange)="recalculateTotal()">
                        </td>
                        <td class="col-status">
                          <span class="badge badge-group">{{ inv.status }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="subtotal-row">
                <span class="fw-medium text-muted">Invoice Total:</span>
                <span class="fw-bold text-accent total-amount">₹{{ invoiceTotal() | number:'1.2-2' }}</span>
              </div>

              <!-- Payment Method -->
              <div class="section-title mt-6">
                <h3>Payment Method</h3>
              </div>
              <div class="method-cards grid-2">
                <div class="method-card cash-card" [class.active]="paymentMethod() === 'Cash'" (click)="paymentMethod.set('Cash')">
                  <div class="radio-circle">
                    @if (paymentMethod() === 'Cash') { 
                      <div class="inner-circle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                    }
                  </div>
                  <div class="method-details">
                    <div class="method-title">Cash Payment</div>
                    <div class="method-desc">Pay from cash accounts</div>
                  </div>
                </div>
                <div class="method-card bank-card" [class.active]="paymentMethod() === 'Bank'" (click)="paymentMethod.set('Bank')">
                  <div class="radio-circle">
                    @if (paymentMethod() === 'Bank') { 
                      <div class="inner-circle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                    }
                  </div>
                  <div class="method-details">
                    <div class="method-title">Bank Transfer</div>
                    <div class="method-desc">Pay via bank accounts</div>
                  </div>
                </div>
              </div>

              <!-- Dynamic Method Details -->
              @if (paymentMethod() === 'Cash') {
                <div class="method-details-box cash-details mt-4 section-animate-in">
                  <div class="details-title">CASH PAYMENT DETAILS</div>
                  <div class="grid-2 mt-2">
                    <div class="form-field">
                      <label class="form-label required">CASH ACCOUNT</label>
                      <select class="form-select"><option>Petty Cash</option></select>
                      <div class="available-balance">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        Available: ₹5000.00
                      </div>
                    </div>
                    <div class="form-field">
                      <label class="form-label required">CASH REPOSITORY</label>
                      <select class="form-select"><option>Cash in Counter</option></select>
                    </div>
                  </div>
                </div>
              } @else if (paymentMethod() === 'Bank') {
                <div class="method-details-box bank-details mt-4 section-animate-in">
                  <div class="details-title">BANK PAYMENT DETAILS</div>
                  <div class="grid-2 mt-2">
                    <div class="form-field">
                      <label class="form-label required">BANK LEDGER</label>
                      <select class="form-select"><option>Select Bank</option></select>
                    </div>
                    <div class="form-field">
                      <label class="form-label">BANK POSTED DATE</label>
                      <input type="date" class="form-input" placeholder="dd/mm/yyyy" [value]="bookDate()">
                    </div>
                  </div>
                  <div class="grid-2 mt-4">
                    <div class="form-field">
                      <label class="form-label">INSTRUMENT CODE</label>
                      <input type="text" class="form-input" placeholder="Cheque/UTR">
                    </div>
                    <div class="form-field">
                      <label class="form-label">TRANSACTION CODE</label>
                      <input type="text" class="form-input" placeholder="Reference">
                    </div>
                  </div>
                </div>
              }

              <!-- Charges / Deduction -->
              <div class="section-title mt-6">
                <h3>Charges / Deduction</h3>
                <button class="btn btn-ghost btn-icon text-accent add-line-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Line
                </button>
              </div>
              <div class="table-container inline-table">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th class="col-account">ACCOUNT</th>
                      <th class="col-costcenter">COST CENTER</th>
                      <th class="col-amount text-right">AMOUNT</th>
                      <th class="col-desc">DESCRIPTION</th>
                      <th class="col-actions text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="col-account">
                        <select class="form-select"><option>Select</option></select>
                      </td>
                      <td class="col-costcenter">
                        <select class="form-select"><option>Select</option></select>
                      </td>
                      <td class="col-amount">
                        <input type="number" class="form-input text-right amount-input" placeholder="0.00">
                      </td>
                      <td class="col-desc">
                        <input type="text" class="form-input" placeholder="Description">
                      </td>
                      <td class="col-actions text-center">
                        <button class="btn btn-ghost btn-icon trash-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="subtotal-row">
                <span class="fw-medium text-muted">Charges Total:</span>
                <span class="fw-bold text-accent total-amount">₹0.00</span>
              </div>

              <!-- Narration -->
              <div class="form-field mt-6">
                <label class="form-label">NARRATION</label>
                <textarea class="form-textarea" placeholder="Add payment notes..."></textarea>
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <div class="footer-left">
            @if (selectedParty()) {
              <div class="footer-calc">
                <span class="text-muted">Invoice: </span>
                <span class="fw-bold">₹{{ invoiceTotal() | number:'1.2-2' }}</span>
                <span class="calc-splitter">-</span>
                <span class="text-muted">Discount: </span>
                <input type="number" class="form-input small-input" placeholder="0.00" [(ngModel)]="discount" (ngModelChange)="recalculateTotal()">
              </div>
            }
          </div>
          <div class="footer-right">
            @if (selectedParty()) {
              <div class="net-payable">
                <span class="net-label">NET PAYABLE</span>
                <span class="net-amount">₹{{ netPayable() | number:'1.2-2' }}</span>
              </div>
            }
            <button class="btn btn-ghost" (click)="close()">Cancel</button>
            <button class="btn btn-secondary">Clear</button>
            <button class="btn btn-secondary" [disabled]="!selectedParty()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save
            </button>
            <button class="btn btn-primary" [disabled]="!selectedParty()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Save & New
            </button>
          </div>
        </div>
      </div>

      <!-- AI Sidebar inside Modal -->
      @if (isAiExpanded()) {
        <div class="payment-modal-ai">
          <app-modal-ai-panel 
            [quickActions]="[
              'Check vendor balance history',
              'Review outstanding invoices',
              'Verify TDS applicability'
            ]"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      z-index: var(--z-modal);
    }
    .overlay-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 1;
      animation: fadeIn 0.2s ease-out forwards;
    }
    
    .modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.98);
      width: 900px;
      max-width: calc(100vw - 32px);
      max-height: 90vh;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      z-index: 2;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      border: 1px solid var(--color-border);
      transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease;
    }

    .modal-container.fullscreen {
      width: calc(100vw - 32px);
      height: calc(100vh - 32px);
      max-height: calc(100vh - 32px);
    }

    .modal-container.ai-expanded {
      width: 1200px;
      max-width: calc(100vw - 32px);
    }
    .modal-container.fullscreen.ai-expanded {
      width: 100vw;
    }

    .modal-content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: #FFFFFF;
    }

    /* AI Sidebar */
    .payment-modal-ai {
      border-left: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      background: var(--color-surface);
      width: 320px;
    }
    ::ng-deep .payment-modal-ai .ai-panel {
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 100% !important;
    }

    /* Header */
    .modal-header {
      height: 64px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .icon-box {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-title { font-size: 16px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); line-height: 1.2; }
    .modal-subtitle { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; }
    
    .header-right { display: flex; align-items: center; gap: 8px; }
    .stimes-fi-pill {
      height: 30px;
      border-radius: var(--radius-full);
      padding: 0 12px;
      gap: 6px;
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      font-size: 12px;
      transition: all var(--transition-fast);
    }
    .stimes-fi-pill.active {
      background: var(--color-accent-light);
      color: var(--color-accent);
      border-color: var(--color-accent-muted);
    }
    .close-btn { color: var(--color-text-muted); }

    /* Body */
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    
    /* Animations & Progressive UI */
    .section-animate-in {
      animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Banners & Cards */
    .info-banner {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: var(--color-accent-light);
      border: 1px solid var(--color-accent-muted);
      border-radius: var(--radius-md);
      color: var(--color-accent);
      gap: 8px;
    }
    .info-text { font-weight: var(--font-weight-medium); flex: 1; }
    .info-amount { font-size: 16px; font-weight: var(--font-weight-bold); }

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .section-title h3 { font-size: 14px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); }
    .section-badge {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .inline-table {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .bb-none { border-bottom: none; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    
    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .data-table th {
      background: var(--color-surface-1);
      padding: 10px 12px;
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
      text-align: left;
    }
    .data-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      vertical-align: middle;
    }
    .data-table tbody tr:last-child td { border-bottom: none; }
    
    .amount-input {
      width: 100px;
      height: 28px;
    }
    .subtotal-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 12px 16px;
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      border-top: none;
      border-bottom-left-radius: var(--radius-md);
      border-bottom-right-radius: var(--radius-md);
      gap: 12px;
    }
    .total-amount { font-size: 14px; }

    /* Method Cards */
    .method-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      background: #FFFFFF;
      transition: all var(--transition-fast);
    }
    .method-card:hover { border-color: var(--color-border-strong); }
    .method-card.cash-card.active { border-color: #10B981; background: #ECFDF5; box-shadow: 0 0 0 1px #10B981; }
    .method-card.cash-card.active .radio-circle { border-color: #10B981; background: #10B981; }
    .method-card.bank-card.active { border-color: var(--color-accent); background: #EFF6FF; box-shadow: 0 0 0 1px var(--color-accent); }
    .method-card.bank-card.active .radio-circle { border-color: var(--color-accent); background: var(--color-accent); }
    
    .radio-circle .inner-circle { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; border-radius: 50%; }
    .method-title { font-weight: var(--font-weight-medium); color: var(--color-text-primary); font-size: 13px; margin-bottom: 4px; }
    .method-desc { font-size: 11px; color: var(--color-text-muted); }

    .method-details-box {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 16px;
      background: var(--color-surface-1);
    }
    .method-details-box.cash-details { border-color: #A7F3D0; background: #F9FAFB; }
    .method-details-box.bank-details { border-color: var(--color-accent-muted); background: #F9FAFB; }
    .details-title { font-size: 11px; font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .cash-details .details-title { color: #10B981; }
    .bank-details .details-title { color: var(--color-accent); }
    .available-balance { display: flex; align-items: center; gap: 4px; color: #10B981; font-size: 11px; margin-top: 6px; padding: 4px 8px; border: 1px solid #A7F3D0; border-radius: 4px; background: #ECFDF5; width: max-content; }

    .add-line-btn { font-size: 12px; height: 26px; padding: 0 8px; }
    .trash-btn { color: var(--color-text-muted); }
    .trash-btn:hover { color: var(--color-danger); }

    /* Footer */
    .modal-footer {
      height: 72px;
      padding: 0 24px;
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-surface);
      flex-shrink: 0;
    }
    .footer-left { display: flex; align-items: center; }
    .footer-right { display: flex; align-items: center; gap: 12px; }
    
    .footer-calc {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .calc-splitter { color: var(--color-border-strong); }
    .small-input { width: 80px; height: 28px; padding: 0 8px; font-size: 12px; }

    .net-payable {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 16px;
      border-right: 1px solid var(--color-border);
      margin-right: 4px;
    }
    .net-label { font-size: 11px; font-weight: var(--font-weight-bold); color: var(--color-text-muted); letter-spacing: 0.05em; }
    .net-amount { font-size: 18px; font-weight: var(--font-weight-bold); color: var(--color-accent); }

    .btn svg { margin-right: 6px; }

    @keyframes popIn {
      from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `]
})
export class PaymentModalComponent {
  service = inject(PaymentService);
  
  // Basic Form State
  docSeries = signal('SP001');
  partyType = signal('Supplier');
  selectedParty = signal('');
  bookDate = signal('2026-03-16');

  // Progressive/Detail State
  invoices = signal<any[]>([]);
  paymentMethod = signal('Cash');
  discount = signal(0);
  
  // UI State
  isFullscreen = signal(false);
  isAiExpanded = signal(false);

  // Computed Totals
  invoiceTotal = computed(() => {
    return this.invoices().reduce((acc, inv) => acc + (inv.paymentAmount || 0), 0);
  });

  netPayable = computed(() => {
    return this.invoiceTotal() - this.discount();
  });

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullscreen();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (this.selectedParty()) {
        console.log('Save triggered');
        this.close();
      }
    }
  }

  onPartySelected(partyId: string) {
    if (partyId) {
      // Fetch mock invoices when party is selected
      const initialInvoices = this.service.getPendingInvoicesForParty(partyId);
      this.invoices.set(initialInvoices);
    } else {
      this.invoices.set([]);
    }
  }

  recalculateTotal() {
    // Triggers reactivity
    this.invoices.update(invs => [...invs]);
  }

  close() {
    this.service.togglePaymentModal(false);
  }

  toggleFullscreen() {
    this.isFullscreen.update(v => !v);
  }

  toggleAiPanel() {
    this.isAiExpanded.update(v => !v);
  }
}
