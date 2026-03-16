import { Injectable, signal, computed } from '@angular/core';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isAction?: boolean;
  actionLabel?: string;
}

const COA_QUICK_ACTIONS = [
  { id: 'qa1', text: 'Explain the purpose of "Cash and Cash Equivalents"' },
  { id: 'qa2', text: 'Suggest sub-accounts for "Cash and Cash Equivalents"' },
  { id: 'qa3', text: 'Validate "Cash and Cash Equivalents" configuration' },
  { id: 'qa4', text: 'Show which financial statement includes "Cash and Cash Equivalents"' },
];

const COA_COMMANDS = [
  { cmd: '/create', desc: 'Create a new account' },
  { cmd: '/explain', desc: 'Explain accounting concept' },
  { cmd: '/suggest', desc: 'Suggest missing accounts' },
  { cmd: '/audit', desc: 'Audit account structure' },
];

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private _messages = signal<ChatMessage[]>([
    {
      id: 'sys-1',
      role: 'system',
      content: '<p>You are in <strong>Chart of Accounts</strong>. I can help you create accounts, explain accounting concepts, suggest missing accounts, and detect structural issues.</p>',
      timestamp: new Date(),
    }
  ]);
  private _isTyping = signal(false);
  private _isPanelOpen = signal(true);
  private _inputValue = signal('');

  readonly messages = this._messages.asReadonly();
  readonly isTyping = this._isTyping.asReadonly();
  readonly isPanelOpen = this._isPanelOpen.asReadonly();
  readonly inputValue = this._inputValue.asReadonly();
  readonly quickActions = COA_QUICK_ACTIONS;
  readonly commands = COA_COMMANDS;

  setInput(val: string): void { this._inputValue.set(val); }

  togglePanel(): void { this._isPanelOpen.update(v => !v); }
  openPanel(): void { this._isPanelOpen.set(true); }

  sendMessage(content: string): void {
    if (!content.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    this._messages.update(m => [...m, userMsg]);
    this._inputValue.set('');
    this._isTyping.set(true);

    setTimeout(() => {
      const reply = this._generateReply(content.trim());
      this._messages.update(m => [...m, reply]);
      this._isTyping.set(false);
    }, 1200);
  }

  sendQuickAction(text: string): void { this.sendMessage(text); }

  private _generateReply(userInput: string): ChatMessage {
    const input = userInput.toLowerCase();
    let content = '';
    let isAction = false;
    let actionLabel = '';

    if (input.includes('facebook ads') || input.includes('create') && input.includes('expense')) {
      content = '<p>I will create account <strong>5220 — Facebook Ads</strong> under <em>Marketing & Advertising</em> expenses. This is a direct operating expense account. Posting will be allowed.</p><p><strong>Account structure:</strong></p><ul><li><strong>Code:</strong> 5220</li><li><strong>Name:</strong> Facebook Ads</li><li><strong>Type:</strong> Expense</li><li><strong>Parent:</strong> Marketing & Advertising (5200)</li><li><strong>Status:</strong> Posting Allowed</li></ul>';
      isAction = true;
      actionLabel = 'Create Account 5220';
    } else if (input.includes('asset structure') || input.includes('correct')) {
      content = '<p>Your asset structure follows standard accounting hierarchy:</p><ul><li>✓ Current Assets (1100) — correctly grouped</li><li>✓ Cash and Receivables — posting accounts mapped</li><li>✓ Non-current Assets (1200) — PP&E sub-structure present</li></ul><p><strong>Suggestion:</strong> Consider adding an <em>Allowance for Doubtful Accounts</em> contra-account under Accounts Receivable (1120) for proper bad debt provisioning.</p>';
    } else if (input.includes('gst') || input.includes('tax payable') || input.includes('missing')) {
      content = '<p>Account <strong>2130 — GST / Tax Payable</strong> already exists under Current Liabilities (2100).</p><p>If you need to add separate accounts:</p><table class="ai-table"><thead><tr><th>Code</th><th>Name</th><th>Type</th></tr></thead><tbody><tr><td>2131</td><td>GST Output Tax</td><td>Liability</td></tr><tr><td>2132</td><td>GST Input Tax Credit</td><td>Asset</td></tr><tr><td>2133</td><td>TDS Payable</td><td>Liability</td></tr></tbody></table><p>Shall I create these sub-accounts?</p>';
      isAction = true;
      actionLabel = 'Create GST Sub-accounts';
    } else if (input.includes('direct') || input.includes('indirect')) {
      content = '<p><strong>Direct Expenses</strong> are costs directly tied to producing goods or services:</p><ul><li>Raw materials, direct labor, manufacturing overhead</li><li>Appear in Cost of Goods Sold (COGS)</li><li>Mapped to Income Statement above Gross Profit</li></ul><p><strong>Indirect Expenses</strong> are overhead costs not directly tied to production:</p><ul><li>Rent, utilities, salaries, marketing</li><li>Appear below Gross Profit on the P&L</li><li>Also called Operating Expenses</li></ul>';
    } else if (input.startsWith('/create') || input.includes('structure')) {
      content = '<p>To create a new account, please specify:</p><ul><li>Account name</li><li>Account type (Asset / Liability / Equity / Income / Expense)</li><li>Parent account (optional)</li></ul><p><em>Example:</em> <code>/create Marketing Expenses under Expenses</code></p>';
    } else if (input.startsWith('/suggest')) {
      content = '<p>Based on your current structure, I recommend adding:</p><table class="ai-table"><thead><tr><th>Code</th><th>Account Name</th><th>Category</th></tr></thead><tbody><tr><td>1150</td><td>Short-term Investments</td><td>Current Assets</td></tr><tr><td>2150</td><td>Deferred Revenue</td><td>Current Liabilities</td></tr><tr><td>5400</td><td>Depreciation Expense</td><td>Expenses</td></tr><tr><td>5500</td><td>Professional Services</td><td>Expenses</td></tr></tbody></table><p>Would you like me to create any of these?</p>';
    } else if (input.startsWith('/audit')) {
      content = '<p><strong>Structure Analysis:</strong></p><ul><li>✓ All 5 root categories present</li><li>✓ Asset/Liability balance maintained</li><li>⚠ No contra-accounts defined for receivables</li><li>⚠ Equity section lacks Reserves/Surplus accounts</li></ul><p><em>Consider adding retained earnings sub-accounts.</em></p>';
    } else {
      content = '<p>Understood. I can help you manage your Chart of Accounts. You can ask me to create accounts, explain accounting concepts, audit your structure, or suggest missing accounts.</p><p>Use <code>/create</code>, <code>/explain</code>, <code>/suggest</code>, or <code>/audit</code> to run specific commands.</p>';
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      isAction,
      actionLabel,
    };
  }
}
