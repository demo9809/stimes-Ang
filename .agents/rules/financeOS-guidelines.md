---
name: financeOS-ui-guidelines
description: "Non-negotiable UI/UX system guidelines for the FinanceOS / StimesERP Angular application. Apply STRICTLY on every component, page, modal, form, and interaction — no exceptions. These rules govern layout architecture, design system, keyboard UX, density, scrolling, AI panel, modals, and shortcuts."
risk: safe
source: self
date_added: "2026-03-08"
---

# FinanceOS / StimesERP — Mandatory UI/UX System Guidelines

These rules are **non-negotiable**. Every component, page, modal, and feature written for this project MUST comply with all rules below. Violating any rule is considered a build failure.

---

## 1. Core Design System Rule (Non-Negotiable)

The entire application must follow a **single unified design system** across all pages and modules.

Maintain strict consistency in:

- Buttons and button behavior
- Input fields
- Dropdowns
- Labels, Icons, Text styles
- Padding and spacing
- Border radius, Shadows, Color usage
- Component states (hover, focus, disabled, active)

**No screen may introduce a new style** unless it is first added globally to the design system (`styles.css`).

Consistency > individual screen creativity. If a component exists, reuse it. Do not redesign the same element differently on another page.

---

## 2. Layout Architecture (Global Layout Rule — Mandatory)

Every main screen MUST always contain:

- **Left/Main Content Panel**
- **Right AI Panel** (StimesFi / Finance AI)

This structure is mandatory across ALL modules:

- Dashboard, Invoices, Journal entries, Payments, Chart of Accounts, Reports, and every accounting module.

**Never create a full-width content screen without the AI panel.**
The AI panel is a core feature, not optional. It must always be visible and docked right.

---

## 3. Content Density Philosophy (Accounting App Rule)

This is a data-heavy accounting system. The UI MUST prioritize:

- Maximum visible data per screen
- Minimal wasted space
- Fast scanning
- Compact layout
- Professional density

Accounting users prefer more data, less scrolling, faster actions. Avoid large empty spacing or oversized UI elements.

---

## 4. Scrolling Rules (Critical)

### No Page-Level Vertical Scrolling

Main pages MUST NOT scroll vertically. If data exceeds screen height: use pagination. Never extend page height.

### Internal Scroll Only Where Needed

Allowed only inside:

- Table body
- AI chat history
- Dropdown lists

Main layout height must remain fixed at viewport height.

---

## 5. Fixed Height Rule

Main content panel and AI panel must always have **equal height**. They must:

- Align top to bottom
- End at same bottom padding
- Never extend beyond screen height

If content increases: paginate or use internal scroll. Never increase container height.

---

## 6. Screen Padding Rule

All pages must maintain **equal padding on all four sides** (Top = Left = Right = Bottom). Both panels must end with visible bottom spacing. Nothing should touch the screen edge.

If screen height becomes smaller: reduce table rows, enable pagination. Never remove bottom padding.

---

## 7. Typography Rules

Always use **compact typography**:

- Small base font size (`--font-size-base: 13px`)
- Compact table text (`--font-size-sm: 12px`)
- Controlled headings
- Minimal decorative typography

This is a productivity tool. Density improves usability.

---

## 8. Spacing & Density Rules

Keep spacing tight and consistent. Use CSS tokens from `styles.css`.

Allowed: compact layout, small gaps, high information density.
Avoid: large empty spacing, oversized cards, decorative whitespace.

---

## 9. Table Behavior Guidelines

Tables must:

- Use full available width
- Align header and rows perfectly
- Right-align numeric columns, left-align text columns
- Use smart column width distribution

If data grows: paginate. Never increase page height.

---

## 10. Button System Rules

All buttons must use the `btn` system from `styles.css`. Use only:

- `.btn-primary` — main CTA
- `.btn-secondary` — alternative action
- `.btn-ghost` — subtle action
- `.btn-danger` — destructive action
- `.btn-icon` — icon-only button

Same height (30px), same radius (`--radius-md: 6px`), same font size, same padding everywhere. **No page-specific button styles.**

---

## 11. Input Field Rules

All inputs use the unified system from `styles.css`:

- `.form-input` — text/number inputs (height: 30px)
- `.form-select` — dropdowns
- `.form-textarea` — multiline
- `.form-label` — labels with `.required` modifier

Same height, radius, padding, focus state, font size everywhere. No custom inputs per page.

---

## 12. Dropdown Rules

Dropdowns must:

- Be same height as inputs (30px)
- Use same radius and shadow
- Never be cropped or cut off — always visible fully within viewport

---

## 13. Label & Field Structure

Every form must use `.form-field` wrapping `.form-label` + input. Required fields use `.form-label.required` which auto-appends ` *`. Required indicator must be consistent everywhere.

---

## 14. Icon System Rules

Use one consistent icon set — inline SVG with `stroke="currentColor"` stroke-width=`2`. All icons same: stroke weight, size scale (13px–16px default), alignment, spacing. No mixing icon styles.

---

## 15. Color & Shadow Rules

Use only CSS tokens from `styles.css`. Maintain consistent:

- `--color-accent` for primary actions
- `--color-border` for separators
- `--color-surface*` variants for backgrounds
- `--shadow-sm/md/lg/float` for elevation
- Type colors: `--color-asset`, `--color-liability`, `--color-equity`, `--color-income`, `--color-expense`

No random color usage per module. Never hardcode hex colors.

---

## 16. AI Panel Rules (Global)

The AI panel (`app-ai-panel`) MUST exist on every main screen, docked to the right. Structure:

- Header (brand, history, new chat, settings, expand)
- Model selector + Chat/Agent toggle
- Context label (shows current module)
- Chat history (scrollable)
- Quick actions + Commands
- Input box

Must remain visually consistent across all modules. Width: `--ai-panel-width: 280px`. Fixed, non-resizable.

---

## 17. Modal Design Rules (Global Structure)

All action modals MUST follow the same structure:

- Header: icon + title + subtitle + close button
- Form body: scrollable if needed
- Footer: shortcut hints (left) + action buttons (right)

Modal border-radius: `--radius-xl: 12px` (consistent everywhere). Inner cards use `--radius-lg: 8px`, inputs use `--radius-md: 6px`.

Do NOT combine: rounded modal + square footer. Corners must be symmetrical.

---

## 18. Modal AI Panel Behavior

Every major modal MUST include a StimesFi AI toggle button in its header. On click:

- Open AI panel inside modal (right side)
- Modal layout expands to accommodate it

Click again → hide AI panel, modal returns to normal width. AI panel must NOT overlay the modal content. Must not be full-screen.

---

## 19. Keyboard-First UX (Critical — Non-Negotiable)

### Auto Focus

When page loads / modal opens / new row added → first primary input auto-focuses. User should start typing immediately without clicking.

### Enter Key Navigation

Press Enter → move to next logical field. Never trap Enter inside a field unless multiline.

### Tab Behavior

Tab → next field. Shift+Tab → previous field. No random tab flow.

### Keyboard Shortcuts (Required on every screen)

| Shortcut              | Action                         |
| --------------------- | ------------------------------ |
| `Ctrl + S`            | Save                           |
| `Ctrl + Shift + S`    | Save and New                   |
| `Esc`                 | Cancel / Close / Go back       |
| `Ctrl + Enter`        | Save and close modal           |
| `Ctrl + N`            | Create new                     |
| `Ctrl + K`            | Command/search bar (Nav Modal) |
| `F7`                  | Open StimesFi AI panel         |
| `F11`                 | Toggle maximize mode           |
| `Delete`              | Delete selected record         |
| `Alt + →` / `Alt + ←` | Next/Previous page             |

### Esc Hierarchy (Strict)

1. Close inner modal → 2. Close outer modal → 3. Close nav modal → 4. Open nav modal (on main screen)

**ESC must NEVER do nothing.**

### Dropdown Keyboard UX

Type to search, arrow navigation, Enter to select, Esc to close. Never force mouse click.

### Table/Grid Keyboard Flow

Enter → next cell, Shift+Enter → previous cell, Arrow keys → navigate cells, Tab → next column, Alt+A → add row, Ctrl+Enter → save grid.

---

## 20. Navigation Modal (Ctrl+K / Windows+Space)

The global nav modal acts as: navigation controller, action launcher, modal opener, AI command entry, central search hub.

Rules:

- Search input auto-focused on open
- Keyboard: Up/Down navigate, Enter execute, Esc close/back
- Search results grouped: Navigation, Actions, Create, AI Assistant
- "Ask StimesFi" uses AI styling and injects query into AI panel on Enter
- Every action must execute fully — no dead clicks, no placeholder actions
- Must feel like Mac Spotlight / Raycast — instant, no lag

---

## 21. Advanced Density & Financial Visibility Standards

### Row Height

Reduce row height everywhere: tables, grids, journal lines, invoice items. Target: compact but readable. Remove unnecessary vertical padding.

### Maximize Workspace (F11)

Every major form must support a Maximize icon in header. On click: expand content pane, collapse sidebar, optionally hide AI panel. Must not break layout or create full-page scroll.

### Dropdown Replacements

- **Grouped Select Panels** for structured data (account type, entry type)
- **Clickable Selection Cards** for binary/small choices (Cash vs Bank, Debit vs Credit)
- **Searchable Command Select** for long datasets (accounts, customers)

Never use legacy long dropdown lists for high-density workflows.

### Financial Emphasis

Always visually distinguish: Outstanding total, Net amount, Subtotal, VAT/GST, Final total, Balance difference. Use slight background tint, accent border, strong typography. **Never hide financial totals below scroll — always sticky or visible.**

### Input Focus Visibility

When user enters a field: field must visually highlight (border-color + box-shadow using `--color-accent`). Focus state must be clear and strong. Accountants must never wonder "where am I editing?"

---

## 22. Responsiveness

Every screen, panel, modal, drawer, table, and empty state must be **fully responsive by default**. No desktop-only exceptions. On small laptops: grid becomes horizontally scrollable, pagination replaces height growth.

---

## Design Violation Conditions

A screen FAILS the standard if it:

- Looks spaced out or feels empty
- Hides financial totals below scroll
- Requires full-page scrolling
- Uses mouse-only interactions
- Introduces non-system colors, radii, or shadows
- Has modals without consistent radius/shadow
- Is missing the AI panel on the right side
- Has buttons that don't match the `btn` system

---

## Implementation Checklist (Run Before Every PR)

### New Component

- [ ] `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] `standalone: true`
- [ ] Signals for state (`signal()`, `input()`, `output()`, `computed()`)
- [ ] Uses `inject()` for DI
- [ ] Uses only CSS tokens from `styles.css` — no hardcoded values
- [ ] Keyboard accessible (tabindex, focus-visible, aria attributes)

### New Page

- [ ] Fixed viewport height (no page scroll)
- [ ] Equal padding all sides
- [ ] AI panel docked right
- [ ] Stats/summary area visible (not below scroll)
- [ ] Keyboard shortcuts registered

### New Modal

- [ ] `border-radius: var(--radius-xl)` (12px)
- [ ] Auto-focuses first field on open
- [ ] Esc closes modal
- [ ] Ctrl+S saves
- [ ] StimesFi AI toggle button in header
- [ ] Footer has shortcut hints

### Performance

- [ ] No layout shifts when switching modes
- [ ] No animation-heavy transitions
- [ ] No blocked focus / keyboard trap
- [ ] Keyboard actions feel instant (system must feel like desktop accounting — fast, direct, predictable)
