export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
export type AccountStatus = 'posting' | 'group';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  isGroup: boolean;
  status: AccountStatus;
  description?: string;
  taxCode?: string;
  accountGroup?: string;
  currency?: string;
  reportType?: string;
  isIntercompany?: boolean;
  intercompanyAccount?: string;
  children: Account[];
  expanded?: boolean;
  selected?: boolean;
}

export interface AccountStats {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalIncome: number;
  totalExpenses: number;
}

export const ACCOUNT_TYPE_CSS: Record<AccountType, string> = {
  Asset: 'badge-asset',
  Liability: 'badge-liability',
  Equity: 'badge-equity',
  Income: 'badge-income',
  Expense: 'badge-expense',
};
