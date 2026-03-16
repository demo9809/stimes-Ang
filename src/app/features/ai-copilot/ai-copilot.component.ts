import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-copilot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="copilot-layout">
      <!-- Left Sidebar (Recent Chats) -->
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <h3>Recent</h3>
          <button class="btn btn-ghost btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        <div class="chat-list">
          <div class="chat-item active">Chart of Accounts Review</div>
          <div class="chat-item">Monthly Tax Accrual Analysis</div>
          <div class="chat-item">Vendor Duplicate Check</div>
          <div class="chat-item">Bank Reconciliation Help</div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <main class="chat-main">
        <!-- Main Chat Content -->
        <div class="chat-container">
          @if (inputActive()) {
            <div class="chat-history">
              <div class="message user">
                <div class="msg-bubble">Analyze the current chart of accounts for compliance with IFRS.</div>
              </div>
              <div class="message ai">
                <div class="msg-bubble">
                  <p>I have analyzed your Chart of Accounts. Overall compliance is <strong>98%</strong>.</p>
                  <p>Here are a few findings:</p>
                  <ul>
                    <li>3 expense accounts are missing tax mappings.</li>
                    <li>There are 2 duplicate vendor accounts in the Liabilities section.</li>
                  </ul>
                </div>
              </div>
            </div>
          } @else {
            <div class="empty-state">
              <div class="glow-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h2>How can I help you today?</h2>
              <p>StimesFi AI is here to assist with your financial data.</p>

              <div class="quick-prompts">
                <button class="prompt-btn" (click)="startChat()">Analyze Chart of Accounts</button>
                <button class="prompt-btn" (click)="startChat()">Find duplicate vendors</button>
                <button class="prompt-btn" (click)="startChat()">Generate monthly report</button>
                <button class="prompt-btn" (click)="startChat()">Check tax compliance</button>
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-box">
            <button class="btn btn-ghost btn-icon attachment-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Ask StimesFi..."
              (keydown.enter)="startChat()"
            />
            <button class="btn btn-primary send-btn" (click)="startChat()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div class="input-footer">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .copilot-layout {
      display: flex;
      height: 100%;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    /* Sidebar */
    .chat-sidebar {
      width: 260px;
      border-right: 1px solid var(--color-border);
      background: #FAFAFA;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
    }
    .sidebar-header h3 { font-size: 14px; font-weight: var(--font-weight-semibold); margin: 0; }
    .chat-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .chat-item {
      padding: 10px 12px;
      font-size: 13px;
      color: var(--color-text-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 0.2s;
    }
    .chat-item:hover { background: var(--color-surface-1); }
    .chat-item.active { background: var(--color-surface-2); color: var(--color-text-primary); font-weight: var(--font-weight-medium); }

    /* Main Chat */
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .empty-state {
      margin-top: 10vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 600px;
      width: 100%;
    }
    .glow-icon {
      width: 80px; height: 80px;
      background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
      color: var(--color-accent);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
    }
    .empty-state h2 { font-size: 28px; font-weight: var(--font-weight-bold); color: var(--color-text-primary); margin: 0 0 8px 0; }
    .empty-state p { color: var(--color-text-secondary); margin: 0 0 32px 0; font-size: 15px; }

    .quick-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    .prompt-btn {
      padding: 12px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: 14px;
      cursor: pointer;
      transition: var(--transition-fast);
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    .prompt-btn:hover { border-color: var(--color-accent); color: var(--color-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

    /* Chat History Content */
    .chat-history {
      width: 100%;
      max-width: 768px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding-bottom: 40px;
    }
    .message { display: flex; flex-direction: column; max-width: 85%; }
    .message.user { align-self: flex-end; }
    .message.ai { align-self: flex-start; }

    .msg-bubble {
      padding: 16px 20px;
      border-radius: 16px;
      font-size: 15px;
      line-height: 1.5;
    }
    .message.user .msg-bubble {
      background: var(--color-surface-2);
      color: var(--color-text-primary);
      border-bottom-right-radius: 4px;
    }
    .message.ai .msg-bubble {
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      border-bottom-left-radius: 4px;
    }
    .msg-bubble p { margin: 0 0 8px 0; }
    .msg-bubble p:last-child { margin: 0; }
    .msg-bubble ul { margin: 0; padding-left: 20px; }
    .msg-bubble li { margin-bottom: 4px; }

    /* Input Area */
    .input-area {
      padding: 16px 24px;
      background: var(--color-surface);
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 1px solid transparent;
    }
    .input-box {
      width: 100%;
      max-width: 768px;
      display: flex;
      align-items: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 24px;
      padding: 6px 12px;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    .input-box:focus-within {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-light);
    }
    .attachment-btn { color: var(--color-text-muted); }
    .attachment-btn:hover { color: var(--color-text-primary); }

    .input-box input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 15px;
      font-family: inherit;
      color: var(--color-text-primary);
      padding: 8px 0;
    }
    .send-btn {
      width: 32px; height: 32px; border-radius: 50%; padding: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .input-footer {
      font-size: 11px;
      color: var(--color-text-muted);
      margin-top: 12px;
      text-align: center;
    }
  `]
})
export class AiCopilotComponent {
  inputActive = signal(false);

  startChat() {
    this.inputActive.set(true);
  }
}
