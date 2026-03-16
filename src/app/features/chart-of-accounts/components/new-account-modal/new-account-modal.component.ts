import {
  Component, ChangeDetectionStrategy, inject, signal, computed,
  OnInit, OnDestroy, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account, AccountType } from '../../../../core/models/account.model';

@Component({
  selector: 'app-new-account-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal" role="dialog" aria-modal="true" aria-label="New Account">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="11" x2="12" y2="17"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
              </svg>
            </div>
            <div>
              <div class="modal-title">{{ editAccount() ? 'Edit Account' : 'New Account' }}</div>
              <div class="modal-subtitle">Add to Chart of Accounts</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" (click)="close.emit()" title="Close (Esc)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-grid">
            <!-- Account Number -->
            <div class="form-field">
              <label class="form-label required" for="code">Account number</label>
              <input
                id="code"
                #firstInput
                class="form-input"
                type="text"
                formControlName="code"
                placeholder="e.g., 5220"
                autocomplete="off"
                (keydown.enter)="focusNext($event)"
              />
              @if (isInvalid('code')) { <span class="field-error">Account number is required</span> }
            </div>

            <!-- Account Name -->
            <div class="form-field">
              <label class="form-label required" for="name">Account name</label>
              <input
                id="name"
                class="form-input"
                type="text"
                formControlName="name"
                placeholder="e.g., Facebook Ads"
                autocomplete="off"
                (keydown.enter)="focusNext($event)"
              />
              @if (isInvalid('name')) { <span class="field-error">Name is required</span> }
            </div>

            <!-- Account Groups -->
            <div class="form-field">
              <label class="form-label required" for="accountGroup">Account Groups</label>
              <select id="accountGroup" class="form-input" formControlName="accountGroup">
                <option value="" disabled selected>Select Group</option>
                <option value="Current Assets">Current Assets</option>
                <option value="Fixed Assets">Fixed Assets</option>
                <option value="Current Liabilities">Current Liabilities</option>
                <option value="Direct Expenses">Direct Expenses</option>
                <option value="Indirect Expenses">Indirect Expenses</option>
                <option value="Income">Income</option>
              </select>
              @if (isInvalid('accountGroup')) { <span class="field-error">Group is required</span> }
            </div>

            <!-- Currency -->
            <div class="form-field">
              <label class="form-label required" for="currency">Currency</label>
              <select id="currency" class="form-input" formControlName="currency">
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <!-- Description -->
            <div class="form-field full-width">
              <label class="form-label" for="description">Description</label>
              <textarea id="description" class="form-textarea" formControlName="description" rows="2"></textarea>
            </div>

            <!-- Parent Account -->
            <div class="form-field">
              <label class="form-label" for="parentId">Parent Account</label>
              <select id="parentId" class="form-input" formControlName="parentId">
                <option value="">Root Level (no parent)</option>
                @for (opt of flatAccounts(); track opt.id) {
                  @if (opt.isGroup) {
                    <option [value]="opt.id">{{ opt.code }} — {{ opt.name }}</option>
                  }
                }
              </select>
            </div>

            <!-- Report Type -->
            <div class="form-field">
              <label class="form-label" for="reportType">Report Type</label>
              <select id="reportType" class="form-input" formControlName="reportType">
                <option value="">Select Report Type</option>
                <option value="Balance Sheet">Balance Sheet</option>
                <option value="Income Statement">Income Statement</option>
                <option value="Cash Flow">Cash Flow</option>
              </select>
            </div>

            <!-- Is Intercompany -->
            <div class="form-field checkbox-field full-width" style="display: flex; align-items: center; margin-top: 10px;">
              <label class="checkbox-label" style="display: flex; gap: 8px; cursor: pointer; align-items: center;">
                <input type="checkbox" formControlName="isIntercompany" style="width: 16px; height: 16px;" />
                <span style="font-size: var(--font-size-sm); color: var(--color-text-primary);">Is intercompany account</span>
              </label>
            </div>

            <!-- Inter company -->
            <div class="form-field full-width">
              <label class="form-label" for="intercompanyAccount">Inter company</label>
              <select id="intercompanyAccount" class="form-input" formControlName="intercompanyAccount">
                <option value="">Select Company</option>
                <option value="Company A">Company A</option>
                <option value="Company B">Company B</option>
                <option value="Subsidiary LLC">Subsidiary LLC</option>
              </select>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="modal-footer">
          <div class="footer-shortcuts">
            <span class="kbd">Ctrl+S</span> Save &nbsp;
            <span class="kbd">Esc</span> Cancel
          </div>
          <div class="footer-actions">
            <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
            <button
              class="btn btn-primary"
              [disabled]="form.invalid || saving()"
              (click)="onSubmit()"
            >
              @if (saving()) { Saving... } @else { Save Account }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: var(--z-modal);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      width: 540px;
      max-width: 95vw;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-float);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px var(--space-5);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }
    .modal-title-group { display: flex; align-items: center; gap: var(--space-3); }
    .modal-icon {
      width: 28px; height: 28px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-title { font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); }
    .modal-subtitle { font-size: var(--font-size-xs); color: var(--color-text-muted); }

    .modal-form { flex: 1; overflow-y: auto; padding: var(--space-5); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    .full-width { grid-column: 1 / -1; }
    .form-hint { font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-normal); }
    .field-error { font-size: var(--font-size-xs); color: var(--color-danger); }

    /* Use standard input/select native styling with form-input */
    select.form-input {
      appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%236B7280" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>');
      background-repeat: no-repeat;
      background-position: right 10px center;
      padding-right: 30px;
    }


    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-5);
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
      background: var(--color-surface-1);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }
    .footer-shortcuts { font-size: 11px; color: var(--color-text-muted); display: flex; align-items: center; gap: var(--space-1); }
    .footer-actions { display: flex; gap: var(--space-2); }
  `]
})
export class NewAccountModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  editAccount = signal<Account | null>(null);
  close = output<void>();
  saved = output<Account>();
  saving = signal(false);

  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    accountGroup: ['', Validators.required],
    currency: ['AED', Validators.required],
    parentId: [''],
    reportType: [''],
    isIntercompany: [false],
    intercompanyAccount: [{ value: '', disabled: true }],
    description: [''],
  });

  readonly flatAccounts = () => this.flattenAccounts(this.accountService.accounts());


  ngOnInit(): void {
    const acct = this.editAccount();
    if (acct) {
      this.form.patchValue({
        code: acct.code,
        name: acct.name,
        accountGroup: acct.accountGroup || '',
        currency: acct.currency || 'AED',
        parentId: acct.parentId || '',
        reportType: acct.reportType || '',
        isIntercompany: !!acct.isIntercompany,
        intercompanyAccount: acct.intercompanyAccount || '',
        description: acct.description || '',
      });
      if (acct.isIntercompany) {
        this.form.get('intercompanyAccount')?.enable();
      }
    }

    this.form.get('isIntercompany')?.valueChanges.subscribe(val => {
      if (val) this.form.get('intercompanyAccount')?.enable();
      else this.form.get('intercompanyAccount')?.disable();
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  focusNext(e: Event): void {
    e.preventDefault();
    const all = Array.from(document.querySelectorAll<HTMLElement>('input, textarea, button:not([disabled])'));
    const curr = e.target as HTMLElement;
    const idx = all.indexOf(curr);
    if (idx >= 0 && idx < all.length - 1) all[idx + 1].focus();
  }

  onBackdropClick(e: MouseEvent): void {
    const cls = (e.target as HTMLElement).classList;
    if (cls.contains('modal-backdrop')) this.close.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.value;

    let derivedType: AccountType = 'Expense';
    if (v.accountGroup?.includes('Asset')) derivedType = 'Asset';
    else if (v.accountGroup?.includes('Liabilit')) derivedType = 'Liability';
    else if (v.accountGroup?.includes('Income')) derivedType = 'Income';
    else if (v.accountGroup?.includes('Equity')) derivedType = 'Equity';

    const newAccount: Account = {
      id: this.editAccount() ? this.editAccount()!.id : Date.now().toString(),
      code: v.code!,
      name: v.name!,
      type: derivedType,
      parentId: v.parentId || null,
      isGroup: false,
      status: 'posting',
      description: v.description || '',
      accountGroup: v.accountGroup || undefined,
      currency: v.currency || undefined,
      reportType: v.reportType || undefined,
      isIntercompany: !!v.isIntercompany,
      intercompanyAccount: v.intercompanyAccount || undefined,
      children: this.editAccount() ? this.editAccount()!.children : [],
    };
    setTimeout(() => {
      this.accountService.addAccount(newAccount);
      this.saving.set(false);
      this.saved.emit(newAccount);
      this.close.emit();
    }, 500);
  }

  private flattenAccounts(accounts: Account[]): Account[] {
    return accounts.reduce((acc: Account[], a) => [...acc, a, ...this.flattenAccounts(a.children)], []);
  }
}
