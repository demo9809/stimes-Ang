import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-journal-filter-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-wrapper" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Advanced Filters</h2>
              <p class="modal-subtitle">Refine your journal entry search</p>
            </div>
          </div>
          <button class="btn-icon" (click)="close.emit()" title="Close (Esc)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>DOCUMENT NUMBER</label>
              <input type="text" class="form-input" placeholder="e.g., JV-2024-0001" autofocus>
            </div>
            <div class="form-group">
              <label>FROM DATE</label>
              <input type="date" class="form-input" placeholder="dd/mm/yyyy">
            </div>
            <div class="form-group">
              <label>TO DATE</label>
              <input type="date" class="form-input" placeholder="dd/mm/yyyy">
            </div>

            <div class="form-group">
              <label>REFERENCE NUMBER</label>
              <input type="text" class="form-input" placeholder="Enter reference...">
            </div>
            <div class="form-group">
              <label>ENTRY TYPE</label>
              <select class="form-select">
                <option value="">All Entry Types</option>
                <option value="General">General</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Depreciation">Depreciation</option>
              </select>
            </div>
            <div class="form-group">
              <label>PAYMENT MODE</label>
              <select class="form-select">
                <option value="">All Payment Modes</option>
              </select>
            </div>

            <div class="form-group">
              <label>DIVISION</label>
              <select class="form-select">
                <option value="">All Divisions</option>
              </select>
            </div>
            <div class="form-group">
              <label>DOCUMENT STATUS</label>
              <select class="form-select">
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Posted">Posted</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div class="form-group additional-options">
            <label class="section-label">ADDITIONAL OPTIONS</label>
            <label class="checkbox-label">
              <input type="checkbox" class="form-checkbox">
              <span>Show Withdrawn Entries</span>
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary btn-clear" (click)="clearAll()">Clear All</button>
          <div class="footer-actions">
            <button class="btn btn-secondary" (click)="close.emit()">Cancel <span class="shortcut">(Esc)</span></button>
            <button class="btn btn-primary" (click)="applyFilters()">Apply Filters <span class="shortcut">(Enter)</span></button>
          </div>
        </div>
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
    .modal-wrapper {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);
      width: 100%; max-width: 800px;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .modal-header {
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .header-content { display: flex; align-items: center; gap: var(--space-3); }
    .header-icon {
      width: 36px; height: 36px; border-radius: var(--radius-md);
      background: var(--color-accent-light); color: var(--color-accent);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-title { font-size: 18px; font-weight: var(--font-weight-bold); margin: 0; }
    .modal-subtitle { font-size: 13px; color: var(--color-text-muted); margin: 2px 0 0 0; }
    .btn-icon { background: transparent; border: none; color: var(--color-text-muted); cursor: pointer; padding: 4px; border-radius: 4px; }
    .btn-icon:hover { background: var(--color-surface-1); color: var(--color-text-primary); }

    .modal-body { padding: var(--space-5); }
    .form-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4) var(--space-3);
      margin-bottom: var(--space-4);
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 11px; font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

    .form-input, .form-select {
      height: 36px; padding: 0 12px;
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      font-size: 13px; color: var(--color-text-primary); font-family: inherit;
      background: var(--color-surface); transition: all 0.2s;
    }
    .form-input:focus, .form-select:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-light); outline: none; }
    .form-input::placeholder { color: var(--color-text-muted); }

    .additional-options { border-top: 1px solid var(--color-border); padding-top: var(--space-4); margin-top: var(--space-2); }
    .section-label { margin-bottom: 8px !important; }
    .checkbox-label {
      display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: var(--font-weight-medium) !important; color: var(--color-text-primary) !important; text-transform: none !important; cursor: pointer; user-select: none;
    }
    .form-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--color-accent); }

    .modal-footer {
      padding: var(--space-4) var(--space-5); background: #F9FAFB; border-top: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .btn-clear { background: #FFFFFF; border: 1px solid var(--color-border); }
    .footer-actions { display: flex; gap: var(--space-2); }
    .btn { height: 36px; padding: 0 16px; border-radius: var(--radius-md); font-size: 13px; font-weight: var(--font-weight-medium); cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit; }
    .btn-secondary { background: #FFFFFF; border: 1px solid var(--color-border); color: var(--color-text-primary); }
    .btn-secondary:hover { background: var(--color-surface-1); }
    .btn-primary { background: var(--color-accent); border: 1px solid var(--color-accent); color: #fff; }
    .btn-primary:focus { box-shadow: 0 0 0 3px var(--color-accent-light); outline: none; }
    .btn-primary:hover { filter: brightness(0.95); }
    .shortcut { font-size: 11px; opacity: 0.7; font-weight: var(--font-weight-normal); margin-left: 4px; }
  `]
})
export class JournalFilterModalComponent {
  close = output<void>();

  clearAll() {
    // Clear logic to be implemented
  }

  applyFilters() {
    // Apply logic to be implemented
    this.close.emit();
  }
}
