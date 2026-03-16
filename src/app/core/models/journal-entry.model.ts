export interface JournalEntry {
  id: string;
  docNo: string;
  status: 'Draft' | 'Posted' | 'Withdrawn';
  postingDate: string; // ISO string
  entryType: 'General' | 'Adjustment' | 'Depreciation' | 'Opening Balance' | 'Closing' | 'Reversal';
  debitTotal: number;
  creditTotal: number;
  balanceState: 'Balanced' | 'Unbalanced';
  risk: 'Low' | 'Medium' | 'High';
  createdBy: string;
  verifiedBy: string | null;
  lines: JournalEntryLine[];
}

export interface JournalEntryLine {
  id: string;
  accountId: string | null;
  debit: number;
  credit: number;
  costCenterId: string | null;
  description: string;
}
