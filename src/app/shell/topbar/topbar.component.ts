import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { AiChatService } from '../../features/ai-panel/services/ai-chat.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      <!-- Search -->
      <button class="global-search" (click)="searchClick.emit()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span class="placeholder">Search anything...</span>
        <span class="shortcut">⌘K</span>
      </button>

      <!-- Right Actions -->
      <div class="topbar-actions">
        <!-- StimesFi Toggle -->
        @if (!aiChat.isPanelOpen()) {
          <button class="stimes-fi-btn" (click)="aiChat.openPanel()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>
            </svg>
            StimesFi AI
          </button>
        }

        <button class="btn btn-ghost btn-icon action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="btn btn-ghost btn-icon action-btn bell-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="badge"></span>
        </button>
        <div class="user-profile">
          <div class="avatar">JD</div>
          <div class="user-info">
            <div class="user-name">John Doe</div>
            <div class="user-org">Acme Corp</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="dropdown-icon">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .global-search {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 400px;
      height: 36px;
      padding: 0 12px;
      background: var(--color-surface-1);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      color: var(--color-text-muted);
      cursor: text;
      transition: all var(--transition-fast);
    }
    .global-search:hover {
      border-color: var(--color-border);
      background: var(--color-surface);
    }
    .placeholder {
      flex: 1;
      text-align: left;
      font-size: var(--font-size-sm);
    }
    .shortcut {
      font-size: 11px;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-placeholder);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      background: var(--color-surface-2);
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--color-surface-1);
      color: var(--color-text-secondary);
    }
    .action-btn:hover { background: var(--color-surface-2); color: var(--color-text-primary); }
    .bell-btn { position: relative; }
    .badge {
      position: absolute;
      top: 6px; right: 8px;
      width: 6px; height: 6px;
      background: var(--color-danger);
      border-radius: 50%;
      border: 1px solid var(--color-surface);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);
    }
    .user-profile:hover { background: var(--color-surface-1); }
    .avatar {
      width: 32px; height: 32px;
      border-radius: var(--radius-full);
      background: var(--color-accent);
      color: #fff;
      font-size: 11px; font-weight: var(--font-weight-bold);
      display: flex; align-items: center; justify-content: center;
    }
    .user-info { display: flex; flex-direction: column; line-height: 1.2; }
    .user-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-primary); }
    .user-org { font-size: 11px; color: var(--color-text-muted); }
    .dropdown-icon { color: var(--color-text-muted); margin-left: 2px; }

    .stimes-fi-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px;
      background: linear-gradient(135deg, #10B981, #0EA5E9);
      color: #fff;
      border: none;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: opacity var(--transition-fast), transform var(--transition-fast);
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    }
    .stimes-fi-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .stimes-fi-btn svg { color: #fff; }
  `]
})
export class TopbarComponent {
  aiChat = inject(AiChatService);
  searchClick = output<void>();
}
