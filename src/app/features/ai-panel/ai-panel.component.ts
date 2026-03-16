import {
  Component, ChangeDetectionStrategy, inject, signal, computed, input,
  ElementRef, viewChild, AfterViewChecked, HostListener, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from './services/ai-chat.service';

@Component({
  selector: 'app-ai-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-panel" [style.width.px]="panelWidth()">
      <div class="resizer-handle" (mousedown)="startResizing($event)" [class.active]="isResizing()"></div>
      <!-- Header -->
      <div class="ai-header">
        <div class="ai-brand">
          <div class="ai-logo" style="background: #10B981; border-radius: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="#FFFFFF"/>
            </svg>
          </div>
          <div>
            <div class="ai-name">Stimes Fi</div>
            <div class="ai-role">Finance Intelligence</div>
          </div>
        </div>
        <!-- ... existing header actions ... -->
        @if (showModalActions()) {
          <div class="ai-header-actions">
            <button class="btn btn-ghost btn-icon" title="History">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-icon" title="New Chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-icon" title="Settings">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-icon" title="Expand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <div class="header-divider"></div>
            <button class="btn btn-ghost btn-icon close-btn" title="Close" (click)="chat.togglePanel()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        }
      </div>

      <!-- Model + Mode Row -->
      <div class="ai-config-row">
        <div class="model-selector">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="model-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <select class="model-select">
            <option value="gpt4">GPT-4</option>
            <option value="gpt35">GPT-3.5</option>
            <option value="claude">Claude 3</option>
          </select>
          <span class="model-tag">Pro</span>
        </div>
        <div class="mode-toggle">
          <button class="mode-btn" [class.active]="mode() === 'chat'" (click)="mode.set('chat')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Chat
          </button>
          <button class="mode-btn" [class.active]="mode() === 'agent'" (click)="mode.set('agent')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Agent
          </button>
        </div>
      </div>

      <!-- Context Label -->
      <div class="ai-context-container">
        <div class="ai-context">
          <span class="context-dot"></span>
          Chart of Accounts
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="ai-messages" #messageContainer>
        @for (msg of chat.messages(); track msg.id) {
          @if (msg.role === 'system') {
            <div class="msg-system" [innerHTML]="msg.content"></div>
          } @else if (msg.role === 'user') {
            <div class="msg-user">
              <div class="msg-bubble user">{{ msg.content }}</div>
            </div>
          } @else {
            <div class="msg-assistant">
              <div class="msg-avatar">Fi</div>
              <div class="msg-content">
                <div class="msg-bubble assistant" [innerHTML]="msg.content"></div>
                @if (msg.isAction && msg.actionLabel) {
                  <button class="action-apply-btn" (click)="applyAction(msg.actionLabel!)">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {{ msg.actionLabel }}
                  </button>
                }
              </div>
            </div>
          }
        }

        @if (chat.isTyping()) {
          <div class="msg-assistant">
            <div class="msg-avatar">Fi</div>
            <div class="msg-bubble assistant typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions & Commands (hidden when chat starts) -->
      @if (!hasStartedChat()) {
        <!-- Quick Actions -->
        <div class="ai-section">
          <div class="ai-section-label">QUICK ACTIONS</div>
          <div class="quick-actions-list">
            <button class="qa-card" (click)="sendQuick('Create a standard expense structure for my business')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="qa-text">Create a standard expense structure for my business</span>
            </button>
            <button class="qa-card" (click)="sendQuick('Check if my accounts follow accounting best practices')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="qa-text">Check if my accounts follow accounting best practices</span>
            </button>
            <button class="qa-card" (click)="sendQuick('Add missing GST and TDS accounts')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="qa-text">Add missing GST and TDS accounts</span>
            </button>
            <button class="qa-card" (click)="sendQuick('Explain which accounts affect P&L vs Balance Sheet')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="qa-text">Explain which accounts affect P&L vs Balance Sheet</span>
            </button>
          </div>
        </div>

        <!-- Commands -->
        <div class="ai-section">
          <div class="ai-section-label">COMMANDS</div>
          <div class="commands-list">
            <button class="cmd-row" (click)="insertCommand('/create')">
              <span class="cmd-badge">/create</span>
              <span class="cmd-desc">Create a new account</span>
            </button>
            <button class="cmd-row" (click)="insertCommand('/explain')">
              <span class="cmd-badge">/explain</span>
              <span class="cmd-desc">Explain accounting concept</span>
            </button>
          </div>
        </div>
      }

      <!-- Input Box -->
      <div class="ai-input-area">
        <div class="ai-input-wrapper">
          <textarea
            class="ai-input"
            #inputEl
            [value]="chat.inputValue()"
            (input)="chat.setInput(inputEl.value)"
            (keydown)="handleInputKey($event)"
            placeholder="Ask AI anything... @ to add files, / for commands"
            rows="1"
          ></textarea>
          <div class="ai-input-actions">
            <div class="ai-input-tools">
              <button class="btn btn-ghost btn-icon footer-icon" title="Attach file">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <button class="btn btn-ghost btn-icon footer-icon" title="Insert image">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </button>
              <button class="btn btn-ghost btn-icon footer-icon" title="Voice input">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                </svg>
              </button>
            </div>
            <button
              class="btn btn-primary send-btn"
              [disabled]="!chat.inputValue().trim()"
              (click)="send()"
              title="Send (Enter)"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-panel { display: flex; flex-direction: column; width: var(--ai-panel-width); height: 100%; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: 0 1px 3px rgba(0,0,0,0.02); flex-shrink: 0; overflow: hidden; position: relative; }
    .resizer-handle { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; cursor: ew-resize; z-index: 10; background: transparent; transition: background 0.2s; }
    .resizer-handle:hover, .resizer-handle.active { background: var(--color-accent); }
    /* Header */
    .ai-header { display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; border-bottom: 1px solid var(--color-border); flex-shrink: 0;
    }
    .ai-brand { display: flex; align-items: center; gap: 10px; }
    .ai-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }
    .ai-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-primary); }
    .ai-role { font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
    .ai-header-actions { display: flex; align-items: center; gap: 4px; }
    .header-divider { width: 1px; height: 16px; background: var(--color-border); margin: 0 4px; }
    .close-btn { color: var(--color-text-primary); opacity: 0.6; }
    .close-btn:hover { opacity: 1; background: var(--color-surface-2); }

    /* Config Row */
    .ai-config-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 8px 16px;
      background: var(--color-surface);
      border-bottom: none;
      flex-shrink: 0;
    }
    .model-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 4px 8px;
      font-size: 12px;
    }
    .model-icon { color: var(--color-accent); margin-right: 2px; }
    .model-select {
      border: none; outline: none; background: transparent;
      font-family: var(--font-family); font-size: 12px; font-weight: var(--font-weight-medium);
      color: var(--color-text-primary); cursor: pointer;
    }
    .model-tag {
      font-size: 9px; font-weight: var(--font-weight-bold); color: var(--color-accent);
      background: #E0E7FF; padding: 1px 4px; border-radius: var(--radius-sm); margin-left: -2px;
    }
    .mode-toggle {
      display: flex;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 2px;
    }
    .mode-btn {
      display: flex; align-items: center; gap: 4px;
      border: none; background: transparent;
      font-size: 12px; font-weight: var(--font-weight-medium); color: var(--color-text-secondary);
      padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition-fast);
    }
    .mode-btn.active { background: var(--color-surface-1); color: var(--color-text-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

    /* Context */
    .ai-context-container {
      padding: 0 16px 16px 16px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .ai-context {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-size: 13px;
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: #FAFAFA;
    }
    .context-dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent);
    }

    /* Messages */
    .ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--color-surface);
    }
    .msg-system { text-align: center; font-size: 13px; color: var(--color-text-muted); margin: 8px 0 16px; line-height: 1.5; padding: 0 16px; }
    .msg-user { display: flex; justify-content: center; width: 100%; margin: 8px 0; }
    .msg-assistant { display: flex; gap: 12px; align-items: flex-start; margin: 8px 0; }
    .msg-avatar {
      width: 28px; height: 28px; border-radius: 6px;
      background: #F3F4F6; color: var(--color-text-primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: var(--font-weight-bold); flex-shrink: 0;
    }
    .msg-content { display: flex; flex-direction: column; gap: 8px; max-width: 90%; flex: 1; }
    .msg-bubble {
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-text-primary);
      width: 100%;
    }
    .msg-bubble.user {
      background: #F3F4F6;
      border-radius: 8px;
      padding: 16px;
      max-width: 90%;
      text-align: left;
    }
    .msg-bubble.assistant {
      background: transparent;
      padding: 0;
      border: none;
    }
    ::ng-deep .msg-bubble.assistant p { margin-bottom: 8px; }
    ::ng-deep .msg-bubble.assistant p:last-child { margin-bottom: 0; }
    ::ng-deep .msg-bubble.assistant ul { margin: 8px 0 8px 20px; padding: 0; }
    ::ng-deep .msg-bubble.assistant li { margin-bottom: 4px; }
    ::ng-deep .msg-bubble.assistant strong { font-weight: var(--font-weight-bold); color: #111827; }
    ::ng-deep .msg-bubble.assistant em { font-style: normal; font-weight: var(--font-weight-medium); color: var(--color-accent); }
    ::ng-deep .msg-bubble.assistant code { font-family: monospace; background: var(--color-surface-2); padding: 2px 4px; border-radius: 4px; font-size: 12px; }
    ::ng-deep .ai-table {
      width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;
      border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);
    }
    ::ng-deep .ai-table th, ::ng-deep .ai-table td {
      padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--color-border);
    }
    ::ng-deep .ai-table th { background: #F9FAFB; font-weight: var(--font-weight-bold); color: var(--color-text-secondary); }
    ::ng-deep .ai-table tr:last-child td { border-bottom: none; }
    ::ng-deep .ai-table tbody tr:hover { background: #F9FAFB; }

    .msg-bubble.typing { display: flex; gap: 4px; align-items: center; height: 36px; padding: 0; }
    .dot { width: 5px; height: 5px; background: var(--color-text-muted); border-radius: 50%; opacity: 0.6; animation: blink 1.4s infinite both; }
    .dot:nth-child(2) { animation-delay: 0.2s; } .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.2); } }

    .action-apply-btn {
      align-self: flex-start;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px;
      background: var(--color-accent-light);
      border: 1px solid var(--color-accent);
      color: var(--color-accent);
      border-radius: var(--radius-md);
      font-size: 12px; font-weight: var(--font-weight-medium);
      cursor: pointer; transition: all var(--transition-fast);
      margin-top: 8px;
    }
    .action-apply-btn:hover { background: var(--color-accent); color: #fff; }

    /* Sections */
    .ai-section {
      padding: 0 16px 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .ai-section-label { font-size: 11px; font-weight: var(--font-weight-bold); color: var(--color-text-muted); letter-spacing: 0.05em; text-transform: uppercase; }

    .quick-actions-list, .commands-list {
      display: flex; flex-direction: column; gap: 10px;
    }
    .qa-card, .cmd-row {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 16px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer; text-align: left;
      transition: all var(--transition-fast);
    }
    .qa-card:hover, .cmd-row:hover {
      background: var(--color-surface-1);
    }
    .qa-card svg { color: var(--color-text-muted); flex-shrink: 0; margin-top: 2px; }
    .qa-text { font-size: 13px; color: var(--color-text-primary); line-height: 1.4; flex: 1; }

    .cmd-badge {
      font-family: var(--font-family); font-size: 13px; font-weight: var(--font-weight-medium);
      color: var(--color-accent); background: #E0E7FF;
      padding: 4px 8px; border-radius: var(--radius-md);
      flex-shrink: 0;
    }
    .cmd-desc { font-size: 13px; color: var(--color-text-primary); line-height: 1.4; display: flex; align-items: center; }

    /* Input Area */
    .ai-input-area {
      padding: 16px;
      background: #FFFFFF;
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }
    .ai-input-wrapper {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 12px;
      display: flex; flex-direction: column; gap: 8px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    .ai-input-wrapper:focus-within { border-color: var(--color-accent); box-shadow: 0 0 0 1px var(--color-accent); }
    .ai-input {
      width: 100%; border: none; outline: none; background: transparent; resize: none;
      font-family: var(--font-family); font-size: 14px; line-height: 1.5; color: var(--color-text-primary);
    }
    .ai-input::placeholder { color: var(--color-text-muted); font-size: 14px; }
    .ai-input-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    .ai-input-tools { display: flex; gap: 8px; }
    .footer-icon { color: var(--color-text-muted); }
    .send-btn {
      height: 32px;
      font-size: 13px;
      font-weight: var(--font-weight-medium);
      padding: 0 16px;
      display: inline-flex;
      align-items: center;
      border-radius: var(--radius-md);
      background: #93C5FD;
      color: #FFFFFF;
      border: none;
      transition: background var(--transition-fast);
      cursor: pointer;
    }
    .send-btn:not(:disabled):hover { background: #60A5FA; }
    .send-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class AiPanelComponent implements AfterViewChecked {
  chat = inject(AiChatService);
  private platformId = inject(PLATFORM_ID);

  mode = signal<'chat' | 'agent'>('chat');
  hasStartedChat = computed(() => this.chat.messages().length > 1);

  showModalActions = input(true);

  panelWidth = signal<number | undefined>(undefined);
  isResizing = signal(false);

  private startX = 0;
  private startWidth = 0;

  private msgContainer = viewChild<ElementRef>('messageContainer');
  private shouldScroll = false;

  constructor() {
     if (isPlatformBrowser(this.platformId)) {
        this.panelWidth.set(window.innerWidth * 0.25);
     }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing()) return;
    const diff = this.startX - event.clientX;
    const newWidth = Math.max(300, Math.min(this.startWidth + diff, window.innerWidth * 0.8));
    this.panelWidth.set(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.isResizing()) {
      this.isResizing.set(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  }

  startResizing(event: MouseEvent) {
    this.isResizing.set(true);
    this.startX = event.clientX;
    this.startWidth = this.panelWidth() || (window.innerWidth * 0.25);
    event.preventDefault();
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      const el = this.msgContainer()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  handleInputKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  send(): void {
    const val = this.chat.inputValue().trim();
    if (!val) return;
    this.chat.sendMessage(val);
    this.shouldScroll = true;
  }

  sendQuick(text: string): void {
    this.chat.sendQuickAction(text);
    this.shouldScroll = true;
  }

  insertCommand(cmd: string): void {
    this.chat.setInput(cmd + ' ');
  }

  applyAction(label: string): void {
    this.chat.sendMessage(`Apply: ${label}`);
    this.shouldScroll = true;
  }
}
