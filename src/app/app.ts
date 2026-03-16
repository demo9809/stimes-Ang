import {
  Component, ChangeDetectionStrategy, inject, signal,
  OnInit, OnDestroy, HostListener, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shell/sidebar/sidebar.component';
import { TopbarComponent } from './shell/topbar/topbar.component';
import { NavModalComponent } from './shell/nav-modal/nav-modal.component';
import { AiPanelComponent } from './features/ai-panel/ai-panel.component';
import { ShortcutsPanelComponent } from './shell/shortcuts-panel/shortcuts-panel.component';
import { AiChatService } from './features/ai-panel/services/ai-chat.service';
import { LayoutService } from './core/services/layout.service';
import { PaymentModalComponent } from './features/accounting/payments/components/payment-modal/payment-modal.component';
import { JournalEntryModalComponent } from './features/accounting/journal-entries/components/journal-entry-modal/journal-entry-modal.component';
import { PaymentService } from './features/accounting/payments/services/payment.service';
import { JournalEntryService } from './features/accounting/journal-entries/services/journal-entry.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, 
    NavModalComponent, AiPanelComponent, ShortcutsPanelComponent,
    PaymentModalComponent, JournalEntryModalComponent
  ],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      @if (!layout.maximized()) {
        <app-sidebar />
      }

      <div class="main-column">
        <!-- Topbar -->
        <app-topbar (searchClick)="navModal.open()" />

        <div class="content-row">
          <!-- Main Content -->
          <main class="app-main">
            <router-outlet />
          </main>

          <!-- AI Panel -->
          @if (!layout.maximized()) {
            @if (aiChat.isPanelOpen()) {
              <app-ai-panel />
            }
            <!-- Shortcuts Panel -->
            <app-shortcuts-panel />
          }
        </div>
      </div>

      <!-- Nav Modal (Ctrl+K or Win+Space) -->
      <app-nav-modal #navModal (onAskAI)="handleAiRoute($event)" />

      <!-- Global Modals via Defer Blocks -->
      @defer (when paymentService.showPaymentModal()) {
        @if (paymentService.showPaymentModal()) {
          <app-payment-modal />
        }
      }

      @defer (when jeService.showCreateModal()) {
        @if (jeService.showCreateModal()) {
          <app-journal-entry-modal (close)="jeService.toggleCreateModal(false)" />
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; overflow: hidden; background: #FAFAFA; }

    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #FAFAFA;
    }

    .main-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .content-row {
      flex: 1;
      display: flex;
      overflow: hidden;
      padding: var(--space-4);
      gap: var(--space-4);
      min-height: 0;
    }

    .app-main {
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: transparent;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  aiChat = inject(AiChatService);
  layout = inject(LayoutService);
  paymentService = inject(PaymentService);
  jeService = inject(JournalEntryService);
  navModal = viewChild<NavModalComponent>('navModal');

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleGlobalKey.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleGlobalKey.bind(this));
  }

  handleGlobalKey(e: KeyboardEvent): void {
    // Ctrl+K or Windows/Command + Space → Open Nav Modal
    if (((e.ctrlKey || e.metaKey) && e.key === 'k') || (e.metaKey && e.code === 'Space')) {
      e.preventDefault();
      this.navModal()?.open();
    }
    // F5 → Open Payment Modal
    if (e.key === 'F5') {
      e.preventDefault();
      this.paymentService.togglePaymentModal(true);
    }
    // F7 → Open Journal Entry Modal
    if (e.key === 'F7') {
      e.preventDefault();
      this.jeService.toggleCreateModal(true);
    }
    // F11 → Toggle Maximize Workspace
    if (e.key === 'F11') {
      e.preventDefault();
      this.layout.toggleMaximize();
    }
  }

  handleAiRoute(query: string): void {
    this.aiChat.openPanel();
    if (query) { this.aiChat.setInput(query); }
  }
}

