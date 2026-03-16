import { Injectable, signal, computed } from '@angular/core';
import { JournalEntry } from '../../../../core/models/journal-entry.model';

@Injectable({ providedIn: 'root' })
export class JournalEntryService {
  private _entries = signal<JournalEntry[]>([
    {
      id: '1', docNo: 'JV-2024-0001', status: 'Posted', postingDate: '2024-02-10', entryType: 'General',
      debitTotal: 125000, creditTotal: 125000, balanceState: 'Balanced', risk: 'Low', createdBy: 'John Doe', verifiedBy: 'Jane Smith',
      lines: [
        { id: 'L1', accountId: '1001', debit: 125000, credit: 0, costCenterId: null, description: 'Office Supplies' },
        { id: 'L2', accountId: '1002', debit: 0, credit: 125000, costCenterId: null, description: 'Bank Account' },
      ]
    },
    {
      id: '2', docNo: 'JV-2024-0002', status: 'Draft', postingDate: '2024-02-12', entryType: 'Adjustment',
      debitTotal: 50000, creditTotal: 49800, balanceState: 'Unbalanced', risk: 'High', createdBy: 'John Doe', verifiedBy: null,
      lines: [
        { id: 'L3', accountId: '1003', debit: 50000, credit: 0, costCenterId: null, description: 'Inventory Adjustment' },
        { id: 'L4', accountId: '1004', debit: 0, credit: 49800, costCenterId: null, description: 'COGS' },
      ]
    },
    {
      id: '3', docNo: 'JV-2024-0003', status: 'Posted', postingDate: '2024-02-11', entryType: 'Depreciation',
      debitTotal: 35000, creditTotal: 35000, balanceState: 'Balanced', risk: 'Medium', createdBy: 'Admin', verifiedBy: 'John Doe',
      lines: [
        { id: 'L5', accountId: '1005', debit: 35000, credit: 0, costCenterId: null, description: 'Depreciation Expense' },
        { id: 'L6', accountId: '1006', debit: 0, credit: 35000, costCenterId: null, description: 'Accumulated Depreciation' },
      ]
    }
  ]);

  private _searchQuery = signal('');
  private _showCreateModal = signal(false);

  readonly entries = this._entries.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly showCreateModal = this._showCreateModal.asReadonly();

  readonly filteredEntries = computed(() => {
    const q = this._searchQuery().toLowerCase();
    return this._entries().filter(e =>
      e.docNo.toLowerCase().includes(q) || e.entryType.toLowerCase().includes(q)
    );
  });

  readonly stats = computed(() => {
    const all = this._entries();
    return {
      totalThisMonth: all.length,
      draft: all.filter(e => e.status === 'Draft').length,
      posted: all.filter(e => e.status === 'Posted').length,
      unbalanced: all.filter(e => e.balanceState === 'Unbalanced').length,
      highRisk: all.filter(e => e.risk === 'High').length
    };
  });

  setSearchQuery(query: string) {
    this._searchQuery.set(query);
  }

  toggleCreateModal(show: boolean) {
    this._showCreateModal.set(show);
  }

  saveEntry(entry: JournalEntry) {
    this._entries.update(list => {
      const existing = list.findIndex(e => e.id === entry.id);
      if (existing >= 0) {
        const updated = [...list];
        updated[existing] = entry;
        return updated;
      }
      return [...list, entry];
    });
  }
}
