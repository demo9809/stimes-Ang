import { Component, ChangeDetectionStrategy, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalEntryLine } from '../../../../../core/models/journal-entry.model';
import { ModalAiPanelComponent } from '../../../../ai-panel/components/modal-ai-panel/modal-ai-panel.component';

@Component({
  selector: 'app-journal-entry-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ModalAiPanelComponent],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="je-modal-outer" [class.maximized]="isMaximized()" [class.has-ai]="showAiPanel()" (click)="$event.stopPropagation()">
        <!-- Main Form Area -->
        <div class="je-modal-main">
          <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Journal Entry #1</h2>
              <p class="modal-subtitle">Create a new journal entry</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-icon" (click)="toggleMaximize()" title="Maximize (F11)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                @if (isMaximized()) {
                  <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
                } @else {
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                }
              </svg>
            </button>
            <button class="btn btn-secondary action-pill" [class.active-ai]="showAiPanel()" (click)="stimesFiClick()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Stimes Fi
            </button>
            <div class="divider"></div>
            <button class="btn-icon" (click)="close.emit()" title="Close (Esc)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="top-meta-grid">
             <div class="form-group">
                <label>DOCUMENT NUMBER SERIES <span class="req">*</span></label>
                <select class="form-select" autofocus>
                   <option>JVXXXX</option>
                </select>
             </div>
             <div class="form-group">
                <label>BOOK DATE <span class="req">*</span></label>
                <input type="date" class="form-input" [value]="todayDate">
             </div>
             <div class="form-group">
                <label>ENTRY TYPE <span class="req">*</span></label>
                <select class="form-select placeholder">
                   <option value="" disabled selected>Select entry type</option>
                   <option>General</option>
                   <option>Adjustment</option>
                </select>
             </div>
          </div>

          <!-- Grid Area -->
          <div class="entry-grid-container">
             <table class="entry-grid">
               <thead>
                 <tr>
                   <th class="col-num">#</th>
                   <th class="col-account">ACCOUNT</th>
                   <th class="col-amount text-right">DEBIT</th>
                   <th class="col-amount text-right">CREDIT</th>
                   <th class="col-cost">COST CENTER</th>
                   <th class="col-desc">DESCRIPTION</th>
                 </tr>
               </thead>
               <tbody>
                 @for (line of lines(); track line.id; let i = $index) {
                   <tr>
                     <td class="col-num">{{ i + 1 }}</td>
                     <td class="col-account">
                       <input type="text" class="grid-input" placeholder="Select account..." [value]="line.accountId || ''">
                     </td>
                     <td class="col-amount">
                       <input type="number" class="grid-input text-right" placeholder="0.00" [value]="line.debit || ''">
                     </td>
                     <td class="col-amount">
                       <input type="number" class="grid-input text-right" placeholder="0.00" [value]="line.credit || ''">
                     </td>
                     <td class="col-cost">
                       <select class="grid-select">
                         <option>Select...</option>
                       </select>
                     </td>
                     <td class="col-desc">
                       <input type="text" class="grid-input" placeholder="Optional..." [value]="line.description">
                     </td>
                   </tr>
                 }
               </tbody>
               <tfoot>
                 <tr>
                   <td colspan="2" class="total-label">TOTAL</td>
                   <td class="total-val text-right">₹0.00</td>
                   <td class="total-val text-right">₹0.00</td>
                   <td colspan="2" class="balance-status text-right">
                     <span class="badge badge-success">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                       Balanced
                     </span>
                   </td>
                 </tr>
               </tfoot>
             </table>
             <button class="add-line-btn" (click)="addLine()">
               + Add line
             </button>
          </div>

          <div class="bottom-meta-grid">
            <div class="form-group flex-2">
              <label>NARRATION</label>
              <textarea class="form-input" rows="2" placeholder="Describe the purpose of this journal entry..."></textarea>
            </div>
            <div class="form-group">
              <label>REF#</label>
              <input type="text" class="form-input" placeholder="Enter reference number">
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <div class="left-actions">
            <button class="btn btn-secondary" (click)="close.emit()">Cancel <span class="shortcut">(Esc)</span></button>
            <button class="btn btn-secondary btn-clear">Clear</button>
          </div>
          <div class="right-actions">
            <button class="btn btn-secondary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save <span class="shortcut">(Ctrl+S)</span>
            </button>
            <button class="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Save and new <span class="shortcut">(Ctrl+Shift+S)</span>
            </button>
          </div>
        </div>
        </div>

        <!-- AI Panel Area -->
        @if (showAiPanel()) {
          <div class="je-modal-ai">
            <app-modal-ai-panel
              [quickActions]="[
                'Suggest accounts for this entry',
                'Check for similar entries',
                'Validate entry compliance',
                'Auto-fill from template'
              ]"
            />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(2px);
      z-index: 1000; display: flex; align-items: center; justify-content: center;
      padding: var(--space-4);
    }
    .je-modal-outer {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);
      width: 100%; max-width: 1100px;
      display: flex; flex-direction: row; overflow: hidden;
      max-height: 90vh; height: auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .je-modal-outer.has-ai {
      max-width: 1400px; /* Wider to accommodate AI panel */
    }
    .je-modal-outer.maximized {
      max-width: calc(100vw - 32px);
      height: calc(100vh - 32px);
      max-height: calc(100vh - 32px);
    }
    .je-modal-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }
    .je-modal-ai {
      border-left: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      background: var(--color-surface);
      width: 320px;
      flex-shrink: 0;
    }
    ::ng-deep .je-modal-ai .ai-panel {
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 100% !important;
    }

    .modal-header {
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    }
    .header-content { display: flex; align-items: center; gap: var(--space-3); }
    .header-icon {
      width: 36px; height: 36px; border-radius: var(--radius-md);
      background: var(--color-accent-light); color: var(--color-accent);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-title { font-size: 18px; font-weight: var(--font-weight-bold); margin: 0; }
    .modal-subtitle { font-size: 13px; color: var(--color-text-muted); margin: 2px 0 0 0; }
    .header-actions { display: flex; align-items: center; gap: var(--space-2); }
    .btn-icon { background: transparent; border: none; color: var(--color-text-secondary); cursor: pointer; padding: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center;}
    .btn-icon:hover { background: var(--color-surface-1); color: var(--color-text-primary); }
    .divider { width: 1px; height: 20px; background: var(--color-border); margin: 0 var(--space-1); }
    .action-pill {
      border-radius: var(--radius-lg); font-weight: var(--font-weight-medium);
      padding: 0 16px; height: 32px; background: #FFFFFF; border: 1px solid var(--color-border);
      color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px;
      font-size: 13px; cursor: pointer;
    }
    .action-pill svg { color: var(--color-accent); }
    .action-pill:hover { background: var(--color-surface-1); }
    .action-pill.active-ai { background: var(--color-accent-light); color: var(--color-accent); border-color: var(--color-accent); }

    .modal-body {
      padding: var(--space-5); flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-4);
    }

    /* Top Grid */
    .top-meta-grid {
      display: grid; grid-template-columns: 2fr 1fr 1.5fr; gap: var(--space-4);
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 11px; font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .req { color: var(--color-danger); }

    .form-input, .form-select, .form-textarea {
      height: 36px; padding: 0 12px;
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      font-size: 13px; color: var(--color-text-primary); font-family: inherit;
      background: var(--color-surface); transition: all 0.2s; width: 100%; box-sizing: border-box;
    }
    textarea.form-input { height: auto; padding: 8px 12px; resize: vertical; }
    .form-select.placeholder { color: var(--color-text-muted); }
    .form-input:focus, .form-select:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-light); outline: none; }
    .form-input::placeholder { color: var(--color-text-muted); }

    /* Entry Grid */
    .entry-grid-container {
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      background: #FFFFFF; overflow: hidden;
    }
    .entry-grid { width: 100%; border-collapse: collapse; font-size: 13px; }
    .entry-grid th {
      background: var(--color-surface-1); font-size: 11px; font-weight: var(--font-weight-bold);
      color: var(--color-text-secondary); text-transform: uppercase; padding: 10px 12px;
      text-align: left; border-bottom: 1px solid var(--color-border); letter-spacing: 0.05em;
    }
    .entry-grid td { padding: 4px 8px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }

    /* Columns Adjustments */
    .col-num { width: 40px; text-align: center; color: var(--color-text-muted); font-size: 12px; }
    .col-account { width: 25%; }
    .col-amount { width: 15%; }
    .col-cost { width: 15%; }
    .col-desc { width: 30%; }
    .text-right { text-align: right !important; }

    /* Inputs inside Grid */
    .grid-input, .grid-select {
      width: 100%; height: 32px; padding: 0 8px; border: 1px solid transparent; border-radius: 4px;
      font-size: 13px; color: var(--color-text-primary); font-family: inherit; background: transparent;
      box-sizing: border-box; transition: border 0.2s;
    }
    .grid-input:focus, .grid-select:focus {
      border-color: var(--color-border); background: var(--color-surface); outline: none;
      box-shadow: 0 0 0 2px var(--color-accent-light);
    }
    .grid-input::placeholder { color: var(--color-text-muted); }

    /* Footer / Table Totals */
    .entry-grid tfoot td { padding: 12px; background: var(--color-surface-1); border-bottom: none; }
    .total-label { font-size: 11px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); text-transform: uppercase; letter-spacing: 0.05em; text-align: right; }
    .total-val { font-weight: var(--font-weight-bold); font-size: 14px; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: var(--font-weight-medium); }
    .badge-success { background: #ECFDF5; color: #10B981; border: 1px solid #A7F3D0; }

    .add-line-btn {
      width: 100%; background: transparent; border: none; color: var(--color-accent); font-size: 13px; font-weight: var(--font-weight-medium);
      padding: 10px 12px; text-align: left; cursor: pointer; transition: background 0.2s;
    }
    .add-line-btn:hover { background: var(--color-surface-1); }

    /* Bottom Grid */
    .bottom-meta-grid { display: flex; gap: var(--space-4); }
    .flex-2 { flex: 2; }
    .bottom-meta-grid .form-group:last-child { flex: 1; }

    /* Modal Footer */
    .modal-footer {
      padding: var(--space-4) var(--space-5); background: #F9FAFB; border-top: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    }
    .left-actions, .right-actions { display: flex; gap: var(--space-2); }

    .btn { height: 36px; padding: 0 16px; border-radius: var(--radius-md); font-size: 13px; font-weight: var(--font-weight-medium); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
    .btn-secondary { background: #FFFFFF; border: 1px solid var(--color-border); color: var(--color-text-primary); }
    .btn-secondary:hover { background: var(--color-surface-1); }
    .btn-primary { background: var(--color-accent); border: 1px solid var(--color-accent); color: #fff; }
    .btn-primary:focus { box-shadow: 0 0 0 3px var(--color-accent-light); outline: none; }
    .btn-primary:hover { filter: brightness(0.95); }
    .btn-clear { background: transparent; border-color: transparent; }
    .btn-clear:hover { background: #E5E7EB; }
    .shortcut { font-size: 11px; opacity: 0.7; font-weight: var(--font-weight-normal); margin-left: 4px; }
    .mr-1 { margin-right: 2px; }
  `]
})
export class JournalEntryModalComponent {
  close = output<void>();
  isMaximized = signal(false);

  // default line count
  lines = signal<Partial<JournalEntryLine>[]>([
    { id: 't1' }
  ]);

  todayDate = new Date().toISOString().split('T')[0];

  toggleMaximize() {
    this.isMaximized.update(v => !v);
  }

  addLine() {
    this.lines.update(v => [...v, { id: 't' + Date.now() }]);
  }

  showAiPanel = signal(false);

  stimesFiClick() {
    this.showAiPanel.update(v => !v);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close.emit();
    }
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleMaximize();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      // Add save execution logic here when needed
    }
  }
}
