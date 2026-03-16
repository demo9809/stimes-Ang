import {
  Component, ChangeDetectionStrategy, input, output,
  OnDestroy, HostListener, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../../core/models/account.model';
import { AccountService } from '../../services/account.service';

export interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  danger?: boolean;
  dividerBefore?: boolean;
}

const MENU_ACTIONS: ContextMenuAction[] = [
  { id: 'edit', label: 'Edit Account', icon: 'edit' },
  { id: 'add-group', label: 'Add Sub-group', icon: 'folder-plus' },
  { id: 'add-account', label: 'Add Sub-account', icon: 'file-plus' },
  { id: 'move', label: 'Move Account', icon: 'move' },
  { id: 'disable', label: 'Disable Account', icon: 'slash', dividerBefore: true },
  { id: 'delete', label: 'Delete Account', icon: 'trash', danger: true },
];

@Component({
  selector: 'app-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div
        class="context-menu"
        [style.top.px]="y()"
        [style.left.px]="x()"
        role="menu"
      >
        <div class="ctx-header">
          <span class="ctx-code">{{ account()?.code }}</span>
          <span class="ctx-name">{{ account()?.name }}</span>
        </div>
        @for (action of menuActions; track action.id) {
          @if (action.dividerBefore) {
            <div class="ctx-divider"></div>
          }
          <button
            class="ctx-item"
            [class.danger]="action.danger"
            (click)="execute(action)"
            role="menuitem"
            tabindex="0"
          >
            <span class="ctx-icon" [innerHTML]="getIcon(action.icon)"></span>
            {{ action.label }}
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .context-menu {
      position: fixed;
      min-width: 180px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-float);
      z-index: var(--z-context-menu);
      overflow: hidden;
      padding: var(--space-1) 0;
    }
    .ctx-header {
      padding: 6px 12px;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 3px;
    }
    .ctx-code { font-size: 10px; color: var(--color-text-muted); display: block; }
    .ctx-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
    }
    .ctx-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      padding: 6px 12px;
      border: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
      text-align: left;
      transition: background var(--transition-fast), color var(--transition-fast);
    }
    .ctx-item:hover { background: var(--color-surface-1); color: var(--color-text-primary); }
    .ctx-item.danger { color: var(--color-danger); }
    .ctx-item.danger:hover { background: var(--color-danger-bg); }
    .ctx-item:focus-visible { outline: 2px solid var(--color-accent); outline-offset: -2px; }
    .ctx-icon { display: flex; align-items: center; width: 14px; flex-shrink: 0; }
    .ctx-divider { height: 1px; background: var(--color-border); margin: 3px 0; }
  `]
})
export class ContextMenuComponent {
  visible = input(false);
  x = input(0);
  y = input(0);
  account = input<Account | null>(null);
  action = output<{ actionId: string; account: Account }>();
  close = output<void>();

  menuActions = MENU_ACTIONS;

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      'edit': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
      'folder-plus': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
      'file-plus': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
      'move': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
      'slash': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      'trash': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    };
    return icons[name] || '';
  }

  execute(action: ContextMenuAction): void {
    const acct = this.account();
    if (acct) this.action.emit({ actionId: action.id, account: acct });
    this.close.emit();
  }
}
