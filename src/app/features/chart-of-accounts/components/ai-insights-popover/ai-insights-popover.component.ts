import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-insights-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div class="popover-backdrop" (click)="close.emit()"></div>
      <div class="insights-popover box-shadow-card">
        <div class="popover-header">
          <div class="popover-title-group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="popover-title">AI Insights</span>
          </div>
          <button class="btn btn-ghost btn-icon" (click)="close.emit()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="popover-body">
          <!-- Compliance Status -->
          <div class="insight-section">
            <div class="section-header">
              <span class="section-title">Compliance Status</span>
              <span class="badge badge-success">98% Compliant</span>
            </div>
            <p class="section-desc">IFRS & local GAAP guidelines are largely met. 2 minor issues found.</p>
          </div>

          <!-- Recommendations -->
          <div class="insight-section">
            <div class="section-header">
              <span class="section-title">Recommendations</span>
            </div>
            <div class="recommendation-list">
              <div class="rec-item">
                <div class="rec-icon warning">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="rec-content">
                  <div class="rec-title">Missing Tax Mapping</div>
                  <div class="rec-desc">3 expense accounts are missing default tax codes.</div>
                </div>
                <button class="btn btn-ghost rec-action">Fix</button>
              </div>
              <div class="rec-item">
                <div class="rec-icon info">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div class="rec-content">
                  <div class="rec-title">Inactive Accounts</div>
                  <div class="rec-desc">12 accounts have had no activity in 24 months.</div>
                </div>
                <button class="btn btn-ghost rec-action">Review</button>
              </div>
            </div>
          </div>

          <!-- Account Distribution -->
          <div class="insight-section">
            <div class="section-header">
              <span class="section-title">Account Distribution</span>
            </div>
            <div class="distribution-bar">
              <div class="dist-segment" style="width: 45%; background: var(--color-asset);" title="Assets 45%"></div>
              <div class="dist-segment" style="width: 25%; background: var(--color-expense);" title="Expenses 25%"></div>
              <div class="dist-segment" style="width: 15%; background: var(--color-liability);" title="Liabilities 15%"></div>
              <div class="dist-segment" style="width: 10%; background: var(--color-income);" title="Income 10%"></div>
              <div class="dist-segment" style="width: 5%; background: var(--color-equity);" title="Equity 5%"></div>
            </div>
            <div class="dist-legend">
              <div class="legend-item"><span class="legend-dot" style="background: var(--color-asset)"></span>Assets</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--color-expense)"></span>Expenses</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--color-liability)"></span>Liab.</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--color-income)"></span>Income</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--color-equity)"></span>Equity</div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .popover-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
    }
    .insights-popover {
      position: absolute;
      top: 56px;
      right: 180px;
      width: 360px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: 0 10px 24px rgba(0,0,0,0.1);
      z-index: 1001;
      display: flex;
      flex-direction: column;
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: top right;
    }

    .popover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-border);
    }
    .popover-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-accent);
    }
    .popover-title { font-weight: var(--font-weight-semibold); font-size: 14px; }

    .popover-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .insight-section { display: flex; flex-direction: column; gap: 8px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; }
    .section-title { font-size: 11px; font-weight: var(--font-weight-bold); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .section-desc { font-size: 12px; color: var(--color-text-secondary); line-height: 1.4; }

    .badge-success { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

    .recommendation-list { display: flex; flex-direction: column; gap: 8px; }
    .rec-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px;
      background: var(--color-surface-1);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }
    .rec-icon {
      width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rec-icon.warning { background: #FEF3C7; color: #D97706; }
    .rec-icon.info { background: #DBEAFE; color: #2563EB; }

    .rec-content { flex: 1; min-width: 0; }
    .rec-title { font-size: 13px; font-weight: var(--font-weight-medium); color: var(--color-text-primary); margin-bottom: 2px; }
    .rec-desc { font-size: 12px; color: var(--color-text-secondary); line-height: 1.3; }

    .rec-action { font-size: 11px; padding: 4px 8px; height: auto; color: var(--color-accent); font-weight: var(--font-weight-medium); }
    .rec-action:hover { background: var(--color-accent-light); }

    /* Distribution Bar */
    .distribution-bar {
      height: 8px;
      border-radius: 4px;
      display: flex;
      overflow: hidden;
      margin-top: 4px;
    }
    .dist-segment { height: 100%; transition: width 0.3s ease; }
    .dist-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
    .legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--color-text-secondary); }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: block; }

    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class AiInsightsPopoverComponent {
  visible = input.required<boolean>();
  close = output<void>();
}
