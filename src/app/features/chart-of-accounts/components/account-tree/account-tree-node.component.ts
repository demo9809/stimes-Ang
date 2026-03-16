import {
  Component, ChangeDetectionStrategy, input, output, signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, ACCOUNT_TYPE_CSS } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-tree-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="tree-node"
      [class.selected]="account().selected"
      [attr.data-id]="account().id"
    >
      <!-- Row -->
      <div
        class="node-row"
        [class.is-group]="account().isGroup"
        [class.selected]="account().selected"
        [style.padding-left.px]="16 + depth() * 16"
        (click)="onSelect()"
        (contextmenu)="onContextMenu($event)"
        (dblclick)="onToggle()"
        tabindex="0"
        (keydown.enter)="onSelect()"
        (keydown.space)="onToggle(); $event.preventDefault()"
        (keydown.arrowRight)="expandIfGroup(); $event.preventDefault()"
        (keydown.arrowLeft)="collapseIfGroup(); $event.preventDefault()"
        role="treeitem"
        [attr.aria-expanded]="account().children.length > 0 ? account().expanded : null"
      >
        <!-- Expand/Collapse Arrow -->
        <div class="node-arrow" (click)="onToggle(); $event.stopPropagation()">
          @if (account().children.length > 0) {
            <svg
              class="arrow-icon"
              [class.expanded]="account().expanded"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
            >
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          } @else {
            <div class="node-leaf-dot"></div>
          }
        </div>

        <!-- Icon -->
        <div class="node-icon">
          @if (account().isGroup) {
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (account().expanded) {
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              } @else {
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              }
            </svg>
          } @else {
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          }
        </div>

        <!-- Code -->
        <span class="node-code">{{ account().code }}</span>

        <!-- Name -->
        <span class="node-name" [class.group-name]="account().isGroup">{{ account().name }}</span>

        <!-- Spacer -->
        <span class="node-spacer"></span>

        <!-- Type Column -->
        <span class="node-type-col">
          <span class="badge" [class]="typeCss()">{{ account().type }}</span>
        </span>

        <!-- Status Column -->
        <span class="node-status-col">
          <span class="badge" [class]="account().status === 'posting' ? 'badge-posting' : 'badge-group'">
            {{ account().status === 'posting' ? 'Posting Allowed' : 'Group Only' }}
          </span>
        </span>

        <!-- Actions Spacer Column -->
        <span class="node-actions-col"></span>
      </div>

      <!-- Children (recursive) -->
      @if (account().expanded && account().children.length > 0) {
        @for (child of account().children; track child.id) {
          <app-account-tree-node
            [account]="child"
            [depth]="depth() + 1"
            (selected)="selected.emit($event)"
            (contextMenu)="contextMenu.emit($event)"
            (toggled)="toggled.emit($event)"
          />
        }
      }
    </div>
  `,
  styles: [`
    .tree-node { display: block; }
    .node-row {
      display: flex;
      align-items: center;
      height: 36px;
      gap: 12px;
      cursor: pointer;
      border-bottom: 1px solid var(--color-surface-2);
      transition: background var(--transition-fast);
      user-select: none;
      padding-right: 16px;
    }
    .node-row:hover { background: var(--color-surface-1); }
    .node-row:focus-visible { outline: 2px solid var(--color-accent); outline-offset: -2px; }
    .node-row.selected { background: var(--color-accent-light) !important; }
    .node-row.is-group:not(.selected) { background: #FFFFFF; }

    .node-arrow {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--color-text-muted);
    }
    .arrow-icon {
      transition: transform var(--transition-fast);
      transform: rotate(0deg);
    }
    .arrow-icon.expanded { transform: rotate(90deg); }
    .node-leaf-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: transparent;
    }

    .node-icon { display: flex; align-items: center; flex-shrink: 0; color: #3B82F6; } /* Default blue for file */
    .is-group .node-icon { color: #F59E0B; } /* Orange for folder */

    .node-code {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      font-variant-numeric: tabular-nums;
      width: 48px;
      flex-shrink: 0;
    }

    .node-name {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      flex: 1;
      min-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .node-name.group-name {
      font-weight: var(--font-weight-medium);
    }

    .node-spacer { flex: 1; }

    .node-type-col {
      width: 80px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .node-status-col {
      width: 120px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .node-actions-col {
      width: 170px; /* Spacer to align with header Expand All / Collapse All */
      flex-shrink: 0;
    }

    :host:last-child .node-row { border-bottom: none; }
  `]
})
export class AccountTreeNodeComponent {
  account = input.required<Account>();
  depth = input<number>(0);
  selected = output<Account>();
  contextMenu = output<{ event: MouseEvent; account: Account }>();
  toggled = output<string>();

  readonly typeCss = computed(() => ACCOUNT_TYPE_CSS[this.account().type]);

  onSelect(): void { this.selected.emit(this.account()); }
  onToggle(): void { this.toggled.emit(this.account().id); }
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.emit({ event, account: this.account() });
  }
  expandIfGroup(): void { if (this.account().isGroup && !this.account().expanded) this.toggled.emit(this.account().id); }
  collapseIfGroup(): void { if (this.account().isGroup && this.account().expanded) this.toggled.emit(this.account().id); }
}
