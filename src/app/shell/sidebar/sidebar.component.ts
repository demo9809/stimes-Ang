import {
  Component, ChangeDetectionStrategy, signal, computed, inject, HostListener
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface NavItem {
  id: string;
  label: string;
  icon: SafeHtml;
  route?: string;
  children?: NavSubItem[];
}

interface NavSubItem {
  id: string;
  label: string;
  route: string;
  dividerBefore?: boolean;
  sectionLabel?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [class.expanded]="expanded()">
      <!-- Logo -->
      <div class="sidebar-brand" (click)="toggleSidebar()" style="cursor: pointer;" title="Toggle Sidebar">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        @if (expanded()) {
          <span class="brand-text">FinanceOS</span>
        }
      </div>

      <!-- Nav Items -->
      <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">
        @for (item of navItems; track item.id) {
          <div class="nav-item-container">
            <button
              class="nav-item"
              [class.active]="activeModule() === item.id"
              [title]="!expanded() ? item.label : ''"
              tabindex="0"
              (click)="toggleModule(item)"
            >
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              @if (expanded()) {
                <span class="nav-label">{{ item.label }}</span>
                @if (item.children) {
                  <svg class="chevron" [class.open]="activeModule() === item.id" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                }
              }
            </button>
            @if (expanded() && activeModule() === item.id && item.children) {
              <div class="sub-nav">
                @for (child of item.children; track child.id) {
                  @if (child.dividerBefore) { <div class="sub-divider"></div> }
                  @if (child.sectionLabel) { <div class="sub-section-label">{{ child.sectionLabel }}</div> }
                  <a class="sub-nav-item" [routerLink]="child.route" routerLinkActive="active">
                    {{ child.label }}
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Bottom Actions -->
      <div class="sidebar-bottom">
        <button class="nav-item action-btn" [title]="!expanded() ? 'Settings' : ''" tabindex="0">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          @if (expanded()) { <span class="nav-label">Settings</span> }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 64px;
      height: 100%;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      flex-shrink: 0;
      overflow: hidden;
      transition: width var(--transition-medium) cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;
      position: relative;
    }
    .sidebar.expanded { width: 240px; }

    .sidebar-brand {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      gap: 12px;
    }
    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #3B82F6;
      color: #ffffff;
      flex-shrink: 0;
    }
    .brand-text {
      font-size: 16px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      white-space: nowrap;
      opacity: 0;
      animation: fadeIn 0.2s forwards 0.1s;
    }

    .sidebar-nav {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: var(--space-4) 12px;
      gap: 4px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-item-container { display: flex; flex-direction: column; width: 100%; }

    .nav-item {
      display: flex;
      align-items: center;
      height: 40px;
      width: 100%;
      border: none;
      border-radius: var(--radius-md);
      background: transparent;
      cursor: pointer;
      color: var(--color-text-secondary);
      transition: background var(--transition-fast), color var(--transition-fast);
      padding: 0 10px;
      gap: 12px;
      white-space: nowrap;
    }
    .sidebar:not(.expanded) .nav-item { justify-content: center; padding: 0; }

    .nav-item:hover { background: var(--color-surface-1); color: var(--color-text-primary); }
    .nav-item:focus-visible { outline: 2px solid var(--color-accent); outline-offset: -2px; }
    .nav-item.active {
      background: var(--color-accent-light);
      color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      color: inherit;
      flex-shrink: 0;
    }
    ::ng-deep .nav-icon svg { display: block; width: 100%; height: 100%; flex-shrink: 0; }

    .nav-label { flex: 1; text-align: left; font-size: 13px; opacity: 0; animation: fadeIn 0.2s forwards 0.1s; }

    .chevron { flex-shrink: 0; color: var(--color-text-muted); transition: transform 0.2s; }
    .chevron.open { transform: rotate(90deg); }

    /* Sub Navigation */
    .sub-nav {
      display: flex;
      flex-direction: column;
      padding: 4px 0 8px 44px;
      gap: 6px;
      animation: slideDown 0.2s ease-out forwards;
    }
    .sub-nav-item {
      font-size: 13px;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 4px 0;
      transition: color var(--transition-fast);
      white-space: nowrap;
    }
    .sub-nav-item:hover { color: var(--color-text-primary); }
    .sub-nav-item.active { color: var(--color-accent); font-weight: var(--font-weight-medium); }
    .sub-divider { height: 1px; background: var(--color-border); margin: 4px 0; width: 80%; }
    .sub-section-label { font-size: 10px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; margin-top: 4px; letter-spacing: 0.05em; }

    .sidebar-bottom {
      width: 100%;
      display: flex;
      padding: 12px;
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
      background: var(--color-surface);
    }
    .action-btn { width: 100%; justify-content: flex-start; }
    .sidebar:not(.expanded) .action-btn { justify-content: center; padding: 0; }

    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SidebarComponent {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private _expanded = signal(false);
  private _activeModule = signal('accounting');

  readonly expanded = this._expanded.asReadonly();
  readonly activeModule = this._activeModule.asReadonly();

  navItems: NavItem[] = [
    {
      id: 'sales', label: 'Sales',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg>`)
    },
    {
      id: 'purchases', label: 'Purchases',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`)
    },
    {
      id: 'reporting', label: 'Reporting',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`)
    },
    {
      id: 'accounting', label: 'Accounting',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12H3M3 6h18M3 18h18"/></svg>`),
      children: [
        { id: 'banking', label: 'Banking', route: '/banking', sectionLabel: 'Banking' },
        { id: 'bank-accounts', label: 'Bank Accounts', route: '/banking/accounts' },
        { id: 'bank-rules', label: 'Bank Rules', route: '/banking/rules' },
        { id: 'coa', label: 'Chart of Accounts', route: '/accounting/chart-of-accounts', dividerBefore: true, sectionLabel: 'Accounting Tools' },
        { id: 'journal-entries', label: 'Journal Entries', route: '/accounting/journal-entries' },
        { id: 'fixed-assets', label: 'Fixed Assets', route: '/fixed-assets' },
      ]
    },
    {
      id: 'tax', label: 'Tax',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`)
    },
    {
      id: 'contacts', label: 'Contacts',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`)
    },
    {
      id: 'projects', label: 'Projects',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`)
    },
    {
      id: 'ai-copilot', label: 'Stimes Fi',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`),
      route: '/ai-copilot'
    },
  ];

  toggleModule(item: NavItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
    if (item.children) {
      if (!this._expanded()) this._expanded.set(true);
      this._activeModule.update(current => current === item.id ? '' : item.id);
    } else {
      this._activeModule.set(item.id);
    }
  }

  toggleSidebar(): void {
    this._expanded.update(v => !v);
  }
}
