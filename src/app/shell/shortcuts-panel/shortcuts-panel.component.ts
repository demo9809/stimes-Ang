import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-shortcuts-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="shortcuts-panel" [class.minimized]="!isExpanded()">
      <!-- Header -->
      <div class="shortcuts-header" (click)="toggle()">
        <div class="module-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M3 14h7v7H3z"/>
          </svg>
        </div>
        @if (isExpanded()) {
          <span class="module-title">Shortcuts</span>
        }
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="chevron" [class.rotated]="!isExpanded()" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      <!-- Scrollable body -->
      @if (isExpanded()) {
        <div class="shortcuts-body">

        <!-- Global Actions -->
        <div class="shortcut-section">
          <div class="section-title">GLOBAL ACTIONS</div>
          <div class="shortcut-list">
            <div class="shortcut-item">
              <span class="action-name">Payment Entry</span>
              <kbd class="key-combo">F5</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Receipt Entry</span>
              <kbd class="key-combo">F6</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Journal Entry</span>
              <kbd class="key-combo">F7</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Sales Invoice</span>
              <kbd class="key-combo">F8</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Purchase Invoice</span>
              <kbd class="key-combo">F9</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Debit Note</span>
              <kbd class="key-combo">F10</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Credit Note</span>
              <kbd class="key-combo">F11</kbd>
            </div>
          </div>
        </div>

        <!-- Page Actions -->
        <div class="shortcut-section">
          <div class="section-title">PAGE ACTIONS</div>
          <div class="shortcut-list">
            <div class="shortcut-item">
              <span class="action-name">New Account</span>
              <kbd class="key-combo">Ctrl+N</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Delete Account</span>
              <kbd class="key-combo">Delete</kbd>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="shortcut-section">
          <div class="section-title">NAVIGATION</div>
          <div class="shortcut-list">
            <div class="shortcut-item">
              <span class="action-name">Navigate</span>
              <kbd class="key-combo">↑/↓</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">Expand/Collapse</span>
              <kbd class="key-combo">←/→</kbd>
            </div>
            <div class="shortcut-item">
              <span class="action-name">View Details</span>
              <kbd class="key-combo">Enter</kbd>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="shortcuts-footer">
        Press keys to trigger actions
      </div>
      }
    </aside>
  `,
  styles: [`
    .shortcuts-panel {
      display: flex;
      flex-direction: column;
      width: 220px;
      height: 100%;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      flex-shrink: 0;
      overflow: hidden;
      transition: width var(--transition-medium) cubic-bezier(0.4, 0, 0.2, 1);
    }
    .shortcuts-panel.minimized {
      width: 48px;
    }

    .shortcuts-header {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0;
      justify-content: center;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      cursor: pointer;
      gap: 8px;
    }
    .shortcuts-panel:not(.minimized) .shortcuts-header {
      padding: 0 16px;
      justify-content: flex-start;
    }
    .module-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--color-surface-2);
      border-radius: 6px;
      color: var(--color-text-primary);
    }
    .module-title {
      flex: 1;
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }
    .chevron { color: var(--color-text-muted); transition: transform 0.2s; flex-shrink: 0; }
    .chevron.rotated { transform: rotate(-90deg); }

    .shortcuts-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .shortcut-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .section-title {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      letter-spacing: 0.05em;
    }

    .shortcut-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .shortcut-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .action-name {
      font-size: 12px;
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }
    .key-combo {
      font-family: var(--font-family);
      font-size: 11px;
      color: var(--color-text-secondary);
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      padding: 2px 6px;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.05);
    }

    .shortcuts-footer {
      padding: 12px 16px;
      font-size: 10px;
      color: var(--color-text-muted);
      text-align: center;
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
    }
  `]
})
export class ShortcutsPanelComponent {
  isExpanded = signal(true);

  toggle() {
    this.isExpanded.update(v => !v);
  }
}
