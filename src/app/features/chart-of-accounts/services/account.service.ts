import { Injectable, signal, computed } from '@angular/core';
import { Account, AccountStats } from '../../../core/models/account.model';

const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1', code: '1000', name: 'Assets', type: 'Asset', parentId: null, isGroup: true, status: 'group',
    description: 'All asset accounts', expanded: true,
    children: [
      {
        id: '1.1', code: '1100', name: 'Current Assets', type: 'Asset', parentId: '1', isGroup: true, status: 'group', expanded: true,
        children: [
          { id: '1.1.1', code: '1110', name: 'Cash and Cash Equivalents', type: 'Asset', parentId: '1.1', isGroup: false, status: 'posting', children: [] },
          { id: '1.1.2', code: '1120', name: 'Accounts Receivable', type: 'Asset', parentId: '1.1', isGroup: false, status: 'posting', children: [] },
          { id: '1.1.3', code: '1130', name: 'Inventory', type: 'Asset', parentId: '1.1', isGroup: false, status: 'posting', children: [] },
          { id: '1.1.4', code: '1140', name: 'Prepaid Expenses', type: 'Asset', parentId: '1.1', isGroup: false, status: 'posting', children: [] },
        ]
      },
      {
        id: '1.2', code: '1200', name: 'Non-current Assets', type: 'Asset', parentId: '1', isGroup: true, status: 'group', expanded: false,
        children: [
          {
            id: '1.2.1', code: '1210', name: 'Property, Plant and Equipment', type: 'Asset', parentId: '1.2', isGroup: true, status: 'group', expanded: false,
            children: [
              { id: '1.2.1.1', code: '1211', name: 'Machinery', type: 'Asset', parentId: '1.2.1', isGroup: false, status: 'posting', children: [] },
              { id: '1.2.1.2', code: '1212', name: 'Furniture and Fixtures', type: 'Asset', parentId: '1.2.1', isGroup: false, status: 'posting', children: [] },
              { id: '1.2.1.3', code: '1213', name: 'Accumulated Depreciation', type: 'Asset', parentId: '1.2.1', isGroup: false, status: 'posting', children: [] },
            ]
          },
          { id: '1.2.2', code: '1220', name: 'Intangible Assets', type: 'Asset', parentId: '1.2', isGroup: false, status: 'posting', children: [] },
          { id: '1.2.3', code: '1230', name: 'Long-term Investments', type: 'Asset', parentId: '1.2', isGroup: false, status: 'posting', children: [] },
        ]
      }
    ]
  },
  {
    id: '2', code: '2000', name: 'Liabilities', type: 'Liability', parentId: null, isGroup: true, status: 'group', expanded: true,
    children: [
      {
        id: '2.1', code: '2100', name: 'Current Liabilities', type: 'Liability', parentId: '2', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '2.1.1', code: '2110', name: 'Accounts Payable', type: 'Liability', parentId: '2.1', isGroup: false, status: 'posting', children: [] },
          { id: '2.1.2', code: '2120', name: 'Short-term Loans', type: 'Liability', parentId: '2.1', isGroup: false, status: 'posting', children: [] },
          { id: '2.1.3', code: '2130', name: 'GST / Tax Payable', type: 'Liability', parentId: '2.1', isGroup: false, status: 'posting', children: [] },
          { id: '2.1.4', code: '2140', name: 'Accrued Expenses', type: 'Liability', parentId: '2.1', isGroup: false, status: 'posting', children: [] },
        ]
      },
      {
        id: '2.2', code: '2200', name: 'Non-current Liabilities', type: 'Liability', parentId: '2', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '2.2.1', code: '2210', name: 'Long-term Debt', type: 'Liability', parentId: '2.2', isGroup: false, status: 'posting', children: [] },
          { id: '2.2.2', code: '2220', name: 'Deferred Tax Liability', type: 'Liability', parentId: '2.2', isGroup: false, status: 'posting', children: [] },
        ]
      }
    ]
  },
  {
    id: '3', code: '3000', name: 'Equity', type: 'Equity', parentId: null, isGroup: true, status: 'group', expanded: false,
    children: [
      { id: '3.1', code: '3100', name: 'Share Capital', type: 'Equity', parentId: '3', isGroup: false, status: 'posting', children: [] },
      { id: '3.2', code: '3200', name: 'Retained Earnings', type: 'Equity', parentId: '3', isGroup: false, status: 'posting', children: [] },
      { id: '3.3', code: '3300', name: "Owner's Drawing", type: 'Equity', parentId: '3', isGroup: false, status: 'posting', children: [] },
    ]
  },
  {
    id: '4', code: '4000', name: 'Income', type: 'Income', parentId: null, isGroup: true, status: 'group', expanded: true,
    children: [
      { id: '4.1', code: '4100', name: 'Sales Revenue', type: 'Income', parentId: '4', isGroup: false, status: 'posting', children: [] },
      { id: '4.2', code: '4200', name: 'Service Revenue', type: 'Income', parentId: '4', isGroup: false, status: 'posting', children: [] },
      { id: '4.3', code: '4300', name: 'Other Income', type: 'Income', parentId: '4', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '4.3.1', code: '4310', name: 'Interest Income', type: 'Income', parentId: '4.3', isGroup: false, status: 'posting', children: [] },
          { id: '4.3.2', code: '4320', name: 'Dividend Income', type: 'Income', parentId: '4.3', isGroup: false, status: 'posting', children: [] },
        ]
      }
    ]
  },
  {
    id: '5', code: '5000', name: 'Expenses', type: 'Expense', parentId: null, isGroup: true, status: 'group', expanded: true,
    children: [
      {
        id: '5.1', code: '5100', name: 'Operating Expenses', type: 'Expense', parentId: '5', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '5.1.1', code: '5110', name: 'Salaries and Wages', type: 'Expense', parentId: '5.1', isGroup: false, status: 'posting', children: [] },
          { id: '5.1.2', code: '5120', name: 'Rent Expense', type: 'Expense', parentId: '5.1', isGroup: false, status: 'posting', children: [] },
          { id: '5.1.3', code: '5130', name: 'Office Supplies', type: 'Expense', parentId: '5.1', isGroup: false, status: 'posting', children: [] },
          { id: '5.1.4', code: '5140', name: 'Utilities Expense', type: 'Expense', parentId: '5.1', isGroup: false, status: 'posting', children: [] },
        ]
      },
      {
        id: '5.2', code: '5200', name: 'Marketing & Advertising', type: 'Expense', parentId: '5', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '5.2.1', code: '5210', name: 'Digital Marketing', type: 'Expense', parentId: '5.2', isGroup: false, status: 'posting', children: [] },
          { id: '5.2.2', code: '5220', name: 'Facebook Ads', type: 'Expense', parentId: '5.2', isGroup: false, status: 'posting', children: [] },
          { id: '5.2.3', code: '5230', name: 'Google Ads', type: 'Expense', parentId: '5.2', isGroup: false, status: 'posting', children: [] },
        ]
      },
      {
        id: '5.3', code: '5300', name: 'Financial Expenses', type: 'Expense', parentId: '5', isGroup: true, status: 'group', expanded: false,
        children: [
          { id: '5.3.1', code: '5310', name: 'Bank Charges', type: 'Expense', parentId: '5.3', isGroup: false, status: 'posting', children: [] },
          { id: '5.3.2', code: '5320', name: 'Interest Expense', type: 'Expense', parentId: '5.3', isGroup: false, status: 'posting', children: [] },
        ]
      }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = signal<Account[]>(MOCK_ACCOUNTS);
  private _selectedAccount = signal<Account | null>(null);
  private _loading = signal(false);

  readonly accounts = this._accounts.asReadonly();
  readonly selectedAccount = this._selectedAccount.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly stats = computed<AccountStats>(() => ({
    totalAssets: 2450000,
    totalLiabilities: 890000,
    totalEquity: 1560000,
    totalIncome: 3250000,
    totalExpenses: 1980000,
  }));

  selectAccount(account: Account | null): void {
    this._accounts.update(accs => this._clearSelection(accs));
    if (account) {
      this._accounts.update(accs => this._setSelected(accs, account.id));
    }
    this._selectedAccount.set(account);
  }

  toggleExpand(accountId: string): void {
    this._accounts.update(accs => this._toggleNode(accs, accountId));
  }

  expandAll(): void {
    this._accounts.update(accs => this._setAllExpanded(accs, true));
  }

  collapseAll(): void {
    this._accounts.update(accs => this._setAllExpanded(accs, false));
  }

  addAccount(account: Account): void {
    this._accounts.update(accs => this._insertAccount(accs, account));
  }

  updateAccount(updated: Account): void {
    this._accounts.update(accs => this._updateNode(accs, updated));
    if (this._selectedAccount()?.id === updated.id) {
      this._selectedAccount.set(updated);
    }
  }

  disableAccount(id: string): void {
    // mark as disabled (stub)
    console.log('Disable account', id);
  }

  deleteAccount(id: string): void {
    this._accounts.update(accs => this._removeNode(accs, id));
    if (this._selectedAccount()?.id === id) {
      this._selectedAccount.set(null);
    }
  }

  private _clearSelection(accounts: Account[]): Account[] {
    return accounts.map(a => ({ ...a, selected: false, children: this._clearSelection(a.children) }));
  }

  private _setSelected(accounts: Account[], id: string): Account[] {
    return accounts.map(a => ({
      ...a,
      selected: a.id === id,
      children: this._setSelected(a.children, id),
    }));
  }

  private _toggleNode(accounts: Account[], id: string): Account[] {
    return accounts.map(a => ({
      ...a,
      expanded: a.id === id ? !a.expanded : a.expanded,
      children: this._toggleNode(a.children, id),
    }));
  }

  private _setAllExpanded(accounts: Account[], expanded: boolean): Account[] {
    return accounts.map(a => ({
      ...a,
      expanded: a.children.length > 0 ? expanded : a.expanded,
      children: this._setAllExpanded(a.children, expanded),
    }));
  }

  private _insertAccount(accounts: Account[], account: Account): Account[] {
    if (!account.parentId) return [...accounts, account];
    return accounts.map(a => ({
      ...a,
      children: a.id === account.parentId
        ? [...a.children, account]
        : this._insertAccount(a.children, account),
    }));
  }

  private _updateNode(accounts: Account[], updated: Account): Account[] {
    return accounts.map(a => ({
      ...(a.id === updated.id ? { ...a, ...updated } : a),
      children: this._updateNode(a.children, updated),
    }));
  }

  private _removeNode(accounts: Account[], id: string): Account[] {
    return accounts
      .filter(a => a.id !== id)
      .map(a => ({ ...a, children: this._removeNode(a.children, id) }));
  }
}
