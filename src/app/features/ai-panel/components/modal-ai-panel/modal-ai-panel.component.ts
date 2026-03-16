import { Component, ChangeDetectionStrategy, inject, signal, computed, input, viewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../services/ai-chat.service';

@Component({
  selector: 'app-modal-ai-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  providers: [AiChatService],
  template: `
    <div class="modal-ai-panel">
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
      </div>

      <!-- Chat Messages & Quick Actions Area -->
      <div class="ai-scroll-area" #messageContainer>
        <div class="ai-messages">
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
              <div class="msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12 2.1 7.1"/><path d="M12 12l9.9 4.9"/></svg>
              </div>
              <div class="msg-bubble assistant typing">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          }
        </div>

        <!-- Quick Actions (hidden when chat starts) -->
        @if (!hasStartedChat() && quickActions().length > 0) {
          <div class="ai-quick-actions">
            <div class="qa-header">SUGGESTED ACTIONS</div>
            <div class="qa-grid">
              @for (action of quickActions(); track action) {
                <button class="qa-pill" (click)="sendQuick(action)">
                  {{ action }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="ai-input-area">
        <div class="ai-input-wrapper">
          <textarea
            class="ai-input"
            #inputEl
            [value]="chat.inputValue()"
            (input)="chat.setInput(inputEl.value)"
            (keydown)="handleInputKey($event)"
            placeholder="Ask AI anything..."
            rows="1"
            maxlength="2000"
          ></textarea>
          
          <div class="ai-input-bottom">
            <div class="ai-input-tools">
              <button class="tool-btn" title="Attach Document" type="button">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              <button class="tool-btn" title="Attach Image" type="button">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </button>
              <button class="tool-btn" title="Voice Input" type="button">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
              </button>
            </div>
            
            <button
              class="btn btn-primary send-btn"
              [disabled]="!chat.inputValue().trim()"
              (click)="send()"
              title="Send (Enter)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .modal-ai-panel { display: flex; flex-direction: column; width: 100%; height: 100%; background: #F9FAFB; overflow: hidden; position: relative; }
    
    /* Header */
    .ai-header { display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; background: #FFFFFF; border-bottom: 1px solid var(--color-border); flex-shrink: 0; z-index: 10; }
    .ai-brand { display: flex; align-items: center; gap: 10px; }
    .ai-logo { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
    .ai-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-primary); letter-spacing: -0.01em; }
    .ai-role { font-size: 10px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

    /* Scroll Area */
    .ai-scroll-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding: 16px 16px 0 16px; scroll-behavior: smooth; }
    .ai-scroll-area::-webkit-scrollbar { width: 6px; }
    .ai-scroll-area::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
    
    /* Messages */
    .ai-messages { display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; flex: 1; }
    .msg-system { text-align: center; font-size: 12px; font-weight: 500; color: var(--color-text-muted); margin: 0 0 8px; line-height: 1.5; padding: 4px 12px; background: #F3F4F6; border-radius: 12px; align-self: center; }
    .msg-user { display: flex; justify-content: flex-end; width: 100%; margin: 4px 0; }
    .msg-assistant { display: flex; gap: 10px; align-items: flex-start; margin: 4px 0; max-width: 95%; }
    
    .msg-avatar { width: 26px; height: 26px; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--color-border); color: var(--color-accent); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    .msg-content { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    
    .msg-bubble { font-size: 13.5px; line-height: 1.5; width: fit-content; word-break: break-word; }
    .msg-bubble.user { background: var(--color-accent); color: #FFFFFF; border-radius: 14px 14px 2px 14px; padding: 10px 14px; box-shadow: 0 2px 5px rgba(59, 130, 246, 0.15); font-weight: 400; }
    .msg-bubble.assistant { background: transparent; color: var(--color-text-primary); padding: 2px 0; }
    
    /* Enhanced Markdown Styling inside Assistant Bubble */
    ::ng-deep .msg-bubble.assistant p { margin: 0 0 10px; }
    ::ng-deep .msg-bubble.assistant p:last-child { margin: 0; }
    ::ng-deep .msg-bubble.assistant ul { margin: 8px 0 8px 18px; padding: 0; list-style-type: disc; color: var(--color-text-secondary); }
    ::ng-deep .msg-bubble.assistant li { margin-bottom: 6px; padding-left: 4px; }
    ::ng-deep .msg-bubble.assistant strong { font-weight: 600; color: var(--color-text-primary); }
    ::ng-deep .msg-bubble.assistant code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #F3F4F6; color: #EF4444; padding: 2px 6px; border-radius: 4px; font-size: 11.5px; border: 1px solid #E5E7EB; }
    
    .msg-bubble.typing { display: flex; gap: 3px; align-items: center; height: 24px; padding: 0 4px; }
    .dot { width: 5px; height: 5px; background: #9CA3AF; border-radius: 50%; opacity: 0.4; animation: pulse 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .dot:nth-child(2) { animation-delay: 0.2s; } .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
    
    .action-apply-btn { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #FFFFFF; border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: var(--radius-md); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; margin-top: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    .action-apply-btn:hover { background: #F3F4F6; border-color: var(--color-border-strong); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
    .action-apply-btn svg { color: var(--color-accent); }

    /* Quick Actions inline styling */
    .ai-quick-actions { display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-bottom: 20px; animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .qa-header { font-size: 10px; font-weight: 700; color: var(--color-text-muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; padding-left: 2px;}
    .qa-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .qa-pill { display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; border: 1px solid var(--color-border); padding: 8px 14px; border-radius: 16px; font-size: 12px; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.02); text-align: left; line-height: 1.3; }
    .qa-pill:hover { background: #F8FAFC; border-color: #CBD5E1; color: var(--color-accent); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.04); }

    /* Input Area - Sticky Footer */
    .ai-input-area { padding: 0 16px 16px 16px; background: linear-gradient(180deg, rgba(249,250,251,0) 0%, rgba(249,250,251,1) 15%); flex-shrink: 0; position: relative; z-index: 10; margin-top: -10px; padding-top: 10px; }
    .ai-input-wrapper { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 14px; padding: 10px 12px 8px 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: all 0.2s ease; }
    .ai-input-wrapper:focus-within { border-color: #93C5FD; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08), 0 0 0 2px rgba(147, 197, 253, 0.2); }
    
    .ai-input { width: 100%; border: none; outline: none; background: transparent; resize: none; font-family: var(--font-family); font-size: 13.5px; line-height: 1.5; color: var(--color-text-primary); min-height: 22px; max-height: 120px; padding: 0; }
    .ai-input::placeholder { color: #9CA3AF; font-size: 13.5px; }
    
    .ai-input-bottom { display: flex; justify-content: space-between; align-items: center; }
    .ai-input-tools { display: flex; gap: 4px; margin-left: -4px; }
    .tool-btn { background: transparent; border: none; padding: 6px; color: #9CA3AF; cursor: pointer; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .tool-btn:hover { background: #F3F4F6; color: var(--color-text-primary); }
    
    .send-btn { width: 30px; height: 30px; border-radius: 8px; background: var(--color-accent); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; padding: 0; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2); }
    .send-btn:not(:disabled):hover { background: #2563EB; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25); }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #9CA3AF; box-shadow: none; transform: none; }
  `]
})
export class ModalAiPanelComponent implements OnInit, AfterViewChecked {
  chat = inject(AiChatService);

  quickActions = input<string[]>([]);

  hasStartedChat = computed(() => this.chat.messages().length > 0);

  private msgContainer = viewChild<ElementRef>('messageContainer');
  private shouldScroll = false;

  ngOnInit(): void {
    this.chat.clearMessages();
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

  applyAction(label: string): void {
    this.chat.sendMessage(`Apply: ${label}`);
    this.shouldScroll = true;
  }
}
