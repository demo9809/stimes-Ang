import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journal-entry-ai-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="je-ai-panel">
      <!-- Header -->
      <div class="je-ai-header">
        <div class="je-ai-brand">
          <div class="je-ai-logo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <div class="je-ai-title">Stimes Fi</div>
            <div class="je-ai-subtitle">Finance Intelligence</div>
          </div>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="je-ai-body">

        <!-- Quick Suggestions -->
        <div class="ai-section mt-0">
          <div class="ai-section-title">QUICK SUGGESTIONS</div>
          <button class="ai-suggestion-btn">
            <span class="ai-iconbulb">💡</span>
            <span class="qa-text">Suggest accounts for this entry</span>
          </button>
          <button class="ai-suggestion-btn">
            <span class="ai-iconsearch">🔍</span>
            <span class="qa-text">Check for similar entries</span>
          </button>
          <button class="ai-suggestion-btn">
            <span class="ai-iconcheck">✅</span>
            <span class="qa-text">Validate entry compliance</span>
          </button>
        </div>

        <!-- AI Insights -->
        <div class="ai-section">
          <div class="ai-section-title">AI INSIGHTS</div>
          <div class="ai-insight-card">
            <div class="insight-title">Entry Pattern Detected</div>
            <div class="insight-desc">This looks similar to depreciation entries. AI can auto-fill common accounts.</div>
          </div>
        </div>

        <!-- Recent Templates -->
        <div class="ai-section">
          <div class="ai-section-title">RECENT TEMPLATES</div>
          <div class="ai-template-card">
            <div class="template-title">Salary Payment</div>
            <div class="template-time">Last used 2 days ago</div>
          </div>
          <div class="ai-template-card">
            <div class="template-title">Asset Depreciation</div>
            <div class="template-time">Last used 5 days ago</div>
          </div>
        </div>

      </div>

      <!-- Footer Input -->
      <div class="je-ai-footer">
        <div class="ai-section-title">ASK AI</div>
        <div class="ai-input-wrapper">
          <input type="text" placeholder="Ask about this entry..." class="ai-inline-input">
          <button class="ai-send-btn" title="Send message">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .je-ai-panel {
      display: flex;
      flex-direction: column;
      width: 320px;
      height: 100%;
      background: var(--color-surface);
      overflow: hidden;
      border-left: 1px solid var(--color-border);
    }

    /* Header */
    .je-ai-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .je-ai-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .je-ai-logo {
      width: 28px;
      height: 28px;
      background: var(--color-accent);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .je-ai-title {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1.2;
    }
    .je-ai-subtitle {
      font-size: 11px;
      color: var(--color-text-muted);
      margin-top: 2px;
      line-height: 1.2;
    }

    /* Body */
    .je-ai-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .ai-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mt-0 {
      margin-top: 0;
    }

    .ai-section-title {
      font-size: 11px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    /* Suggestions */
    .ai-suggestion-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--color-surface);
      border: 1px solid var(--color-accent-muted);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);
      box-shadow: 0 1px 2px rgba(37, 99, 235, 0.05);
    }
    .ai-suggestion-btn:hover {
      background: var(--color-accent-light);
      border-color: var(--color-accent);
    }
    .ai-suggestion-btn span:first-child {
      font-size: 14px;
    }
    .qa-text {
      font-size: 13px;
      color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }

    /* Insights */
    .ai-insight-card {
      padding: 12px;
      background: #FFFBEB; /* light yellow bg */
      border: 1px solid #FDE68A; /* yellow border */
      border-radius: var(--radius-md);
    }
    .insight-title {
      font-size: 13px;
      font-weight: var(--font-weight-bold);
      color: #D97706; /* dark orange text */
      margin-bottom: 4px;
    }
    .insight-desc {
      font-size: 12px;
      color: #92400E;
      line-height: 1.4;
    }

    /* Templates */
    .ai-template-card {
      padding: 12px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .ai-template-card:hover {
      background: var(--color-surface-1);
      border-color: var(--color-border-strong);
    }
    .template-title {
      font-size: 13px;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin-bottom: 2px;
    }
    .template-time {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    /* Footer */
    .je-ai-footer {
      padding: var(--space-4);
      background: var(--color-surface);
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ai-input-wrapper {
      display: flex;
      align-items: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 4px 4px 4px 12px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    .ai-input-wrapper:focus-within {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent-light);
    }
    .ai-inline-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 13px;
      color: var(--color-text-primary);
    }
    .ai-inline-input::placeholder {
      color: var(--color-text-placeholder);
    }
    .ai-send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--color-accent);
      border-radius: 4px;
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    .ai-send-btn:hover {
      background: var(--color-accent-light);
    }
  `]
})
export class JournalEntryAiPanelComponent {}
