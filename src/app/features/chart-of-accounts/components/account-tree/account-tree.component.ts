import {
  Component, ChangeDetectionStrategy, inject, signal,
  HostListener, ElementRef, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { AccountTreeNodeComponent } from './account-tree-node.component';
import { Account } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AccountTreeNodeComponent],
  template: `
    <div class="tree-container" (contextmenu)="closeContextMenu()">
      <!-- Column Headers -->
      <div class="tree-header">
        <div class="col-code">CODE</div>
        <div class="col-name">ACCOUNT NAME</div>
        <div class="col-spacer"></div>
        <div class="col-type">TYPE</div>
        <div class="col-status">STATUS</div>
        <div class="col-actions">
          <button class="header-action-btn" (click)="accountService.expandAll()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span class="action-text text-accent">Expand All</span>
          </button>
          <button class="header-action-btn" (click)="accountService.collapseAll()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="action-text text-muted">Collapse All</span>
          </button>
        </div>
      </div>

      <!-- Tree Body (scrollable) -->
      <div class="tree-body" role="tree" aria-label="Chart of accounts">
        @for (account of accountService.accounts(); track account.id) {
          <app-account-tree-node
            [account]="account"
            [depth]="0"
            (selected)="selectAccount($event)"
            (contextMenu)="showContextMenu($event)"
            (toggled)="accountService.toggleExpand($event)"
          />
        }
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
    }
    .tree-container { 
      display: flex; 
      flex-direction: column; 
      flex: 1; 
      min-height: 0; 
      overflow: hidden; 
      background: #FFFFFF; 
    }

    .tree-header {
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 16px;
      background: #FFFFFF;
      border-bottom: 1px solid var(--color-border);
      gap: 12px;
      flex-shrink: 0;
    }
    .tree-header > div:not(.col-actions) {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .col-code { width: 60px; flex-shrink: 0; }
    .col-name { flex: 1; min-width: 200px; }
    .col-spacer { flex: 1; }
    .col-type { width: 80px; flex-shrink: 0; text-align: left; }
    .col-status { width: 120px; flex-shrink: 0; text-align: left; }
    .col-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: auto;
    }
    .header-action-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
      padding: 2px 4px;
      border-radius: var(--radius-sm);
    }
    .header-action-btn:hover { background: var(--color-surface-1); }
    .text-accent { color: var(--color-accent); }
    .text-muted { color: var(--color-text-secondary); }

    .tree-body { flex: 1; overflow-y: auto; padding-top: 4px; }
  `]
})
export class AccountTreeComponent {
  accountService = inject(AccountService);
  accountSelected = output<Account>();
  contextMenuEvent = output<{ event: MouseEvent; account: Account }>();

  selectAccount(account: Account): void {
    this.accountService.selectAccount(account);
    this.accountSelected.emit(account);
  }

  showContextMenu(data: { event: MouseEvent; account: Account }): void {
    this.contextMenuEvent.emit(data);
  }

  closeContextMenu(): void {}
}
