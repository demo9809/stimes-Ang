# FinanceOS / StimesFi UI-UX System Guidelines

## 1. Core Design System Rule (Non-Negotiable)

The entire application must follow a single unified design system across all pages and modules.

At any cost, maintain consistency in:

* Buttons and button behavior
* Input fields
* Dropdowns
* Labels
* Icons
* Text styles
* Padding and spacing
* Border radius
* Shadows
* Color usage
* Component states (hover, focus, disabled, active)

No screen should introduce a new style unless it is added globally to the design system first.

Consistency across the system is more important than individual screen creativity.

If a component exists already, reuse it.
Do not redesign the same element differently on another page.

---

# 2. Layout Architecture (Global Layout Rule)

## Two-Panel Layout Mandatory

Every main screen must always contain:

Left/Main Content Panel
Right AI Panel (StimesFi / Finance AI)

This structure must remain consistent across:

* Dashboard
* Invoices
* Journal entries
* Payments
* Chart of accounts
* Reports
* All accounting modules

Never create a full-width content screen without the AI panel.

The AI panel is a core feature, not optional UI.

---

# 3. Content Density Philosophy (Accounting App Rule)

This is a data-heavy accounting system.

The UI must prioritize:

* Maximum visible data per screen
* Minimal wasted space
* Fast scanning
* Compact layout
* Professional density

Avoid large empty spacing or oversized UI.

Accounting users prefer:
More data visible
Less scrolling
Faster actions

---

# 4. Scrolling Rules (Critical)

## No Page-Level Vertical Scrolling

Main pages must NOT scroll vertically.

If data exceeds screen height:
Convert tables into pagination
Never extend page height

The entire screen must fit within viewport height.

## Internal Scroll Only Where Needed

Allowed only inside:

* Table body
* AI chat history
* Dropdown lists

Main layout height must remain fixed.

---

# 5. Fixed Height Rule

Main content panel and AI panel must always have equal height.

They must:

* Align top to bottom
* End at same bottom padding
* Never extend beyond screen height

If content increases:
Use pagination or internal scroll
Never increase container height

---

# 6. Screen Padding Rule

All pages must maintain equal padding on all four sides.

Top = Left = Right = Bottom padding.

Both panels must end with visible bottom spacing.
Nothing should touch screen edge.

If screen height becomes smaller:
Reduce table rows
Enable pagination
Never remove bottom padding
Never push content outside viewport

---

# 7. Typography Rules

Always use compact typography to support dense data.

* Small base font size
* Compact table text
* Controlled headings
* Minimal decorative typography

This is a productivity tool.
Density improves usability.

---

# 8. Spacing & Density Rules

Keep spacing tight and consistent.

Allowed:
Compact layout
Small gaps
High information density

Avoid:
Large empty spacing
Oversized cards
Decorative whitespace

---

# 9. Table Behavior Guidelines

Tables must:

* Use full available width
* Align header and rows perfectly
* Right align numeric columns
* Left align text columns
* Use smart column width distribution

If data grows:
Use pagination
Never increase page height

---

# 10. Button System Rules

All buttons must follow same system:

Same height
Same radius
Same padding
Same font size
Same states

Types:
Primary
Secondary
Ghost
Danger

No page-specific button styles allowed.

---

# 11. Input Field Rules

All input elements must follow one unified system.

Includes:

* Text input
* Number input
* Dropdown
* Date picker
* Textarea
* Inline editor inputs

Rules:
Same height
Same radius
Same padding
Same focus state
Same font size

No custom inputs per page.

---

# 12. Dropdown Rules

Dropdown must be:

* Same height as inputs
* Same radius
* Same shadow
* Same hover style

Dropdown menus must never be cropped or cut off.
Always visible fully within viewport.

---

# 13. Label & Field Structure

Every form must use consistent label system.

Labels:
Small size
Medium weight
Consistent spacing

Required indicator must be consistent everywhere.

---

# 14. Icon System Rules

Use one consistent icon set.

Same:
Stroke weight
Size scale
Alignment
Spacing

No mixing icon styles.

---

# 15. Color & Shadow Rules

Maintain consistent:
Primary colors
Hover states
Borders
Background tones
Shadows

No random color usage per module.

---

# 16. AI Panel Rules (Global)

AI panel must exist on every main screen.

Structure:
Header
Model selector
Chat/Agent toggle
Context label
Chat history or quick actions
Input box

Must remain visually consistent across modules.

---

# 17. Modal Design Rules

All action modals must follow same structure.

Examples:
Journal entry
Payments
Receipts
Accounts
Invoices

Layout:
Left → Form/content
Right → StimesFi AI panel

---

# 18. Modal AI Panel Behavior

Each modal must include StimesFi button in header.

Click:
Open AI panel inside modal (right side)

Click again:
Hide AI panel

AI panel must:
Be part of modal layout
Not overlay popup
Not full screen

Modal expands when AI opens
Returns when closed

Must be consistent everywhere.

---

# 19. Keyboard-First UX (Critical Requirement)

This system must be fully keyboard-friendly.

Accountants prefer keyboard over mouse.
Design must support keyboard-first workflow.

## Core Rules

### Auto Focus

Whenever:

* Page loads
* Modal opens
* New row added

First primary input must auto-focus.

User should start typing immediately without clicking.

---

### Enter Key Navigation

Press Enter must move to next logical field.

Flow must follow natural data entry order:
Customer → Date → Item → Qty → Rate → Account → Save

Never trap Enter inside field unless multiline.

---

### Tab Behavior

Tab must follow structured form order.
Shift + Tab must go backward logically.

No random tab flow.

---

### Keyboard Shortcuts (Required)

Must support:

* Enter → Next field
* Ctrl + S → Save
* Ctrl + Enter → Save & New
* Esc → Close modal
* Arrow keys → Navigate dropdowns
* Typing → Auto search dropdown

All major actions must be accessible without mouse.

---

### Dropdown Keyboard UX

Dropdown must support:
Type to search
Arrow navigation
Enter to select
Esc to close

User must never be forced to click dropdown with mouse.

---

### Table Entry Keyboard Flow

In grids:
Enter → Move to next cell
Shift+Enter → Previous cell
Arrow keys → Navigate cells
Tab → Next column
Ctrl + Add → Add new row

User must be able to complete invoice/journal without mouse.

---

### Modal Keyboard Rules

When modal opens:
Auto focus first field

Esc:
Closes modal

Enter:
Moves through fields logically

Save shortcuts must work inside modal.

---

# 20. Consistency Enforcement Rule

Before adding new UI:
Check existing component
Reuse system
Do not redesign

If new style needed:
Add to design system globally first.

Never create one-off UI.

---

# Final Principle

This is a professional accounting system.

Design must feel:
Consistent
Dense
Keyboard fast
Efficient
Predictable

Every screen must feel like one unified product.





## Navigation Modal Keyboard System (Global Standard)

The Navigation Modal is the central keyboard-first control hub of the entire application.  
It must behave consistently across all screens and must never break the keyboard-first philosophy.

This system is mandatory and global.

---

### Core Purpose

The navigation modal acts as:

- Global navigation controller  
- Action launcher  
- Modal opener  
- AI command entry  
- Central search hub  

Users must be able to operate the full system without touching the mouse.

---

## Opening the Navigation Modal

### Global Shortcut (from any screen)
Press:

**Windows + Space**

This must work:
- From any page
- From inside any modal
- From any input field (except when typing text actively)
- Even when AI panel is open

This shortcut always opens the Navigation Modal.

---

## ESC Key Behavior (Strict Rule)

ESC must always follow a hierarchy.

### Priority order:

1. If any modal is open → close that modal
2. If nested modal inside modal → close inner first
3. If only navigation modal open → close navigation modal
4. If on main screen (no modal open) → open navigation modal

ESC should NEVER do nothing.

ESC must always move user one step back.

---

## Navigation Modal Structure

Navigation modal shows:

- Search input (auto focused)
- Main navigation items
- Search results
- Quick actions
- AI actions
- Footer showing keyboard hints

Search box must always be auto-focused when modal opens.

---

## Keyboard Navigation Rules

### Arrow Navigation

- Up/Down → move between items
- Right Arrow → open selected main menu
- Left Arrow → go back to previous level
- Enter → execute selected item
- ESC → go back / close modal

### Submenu Navigation

When user selects a main menu:

Press:
- Enter OR Right Arrow → open submenu
- Left Arrow OR ESC → go back to main menu

All navigation must happen inside same modal.
Never open new modal for submenus.

---

## Search Behavior (Central Search Hub)

Search input acts as global system search.

It must search:

- Pages
- Sub pages
- Create actions
- Modals
- Reports
- Settings
- AI queries

Search results must show grouped:

Example:
- Navigation
- Actions
- Create
- AI Assistant

---

## AI Assistant Integration (StimesFi)

When user types anything in search:

Show:
Ask StimesFi: "user query"

This must appear visually distinct:
- Use AI gradient
- Include AI icon
- Label: AI Assistant

### On ENTER or click:

System must:
1. Close navigation modal
2. Open StimesFi AI panel (full open)
3. Inject typed query
4. Auto-send query
5. Focus AI panel

Must behave exactly like pressing F7.

No manual typing required again.

---

## Action Execution Rules

Every item in navigation modal must execute fully.

### Page navigation
If selected item = page  
→ close modal  
→ open page  

### Create actions
If selected item = create journal / invoice / payment etc  
→ close modal  
→ open corresponding modal  
→ focus first field  

### AI action
If selected item = Ask StimesFi  
→ open AI panel  
→ send query  

No dead clicks allowed.
No placeholder actions.

Everything must execute instantly on ENTER.

---

## Focus Rules

When navigation modal opens:
- Cursor auto in search input
- First result auto highlighted
- Arrow keys must work instantly

After executing any action:
- Focus must move correctly
- If modal opened → focus first input
- If page opened → focus first primary input

---

## Visual Consistency

Navigation modal must always:
- Use same design system
- Same radius
- Same padding
- Same shadows
- Same font scale
- Same spacing

Do not redesign per page.

---

## Performance Requirement

Navigation modal must open instantly.
No lag.
No loading delay.
No UI shift.

It should feel like Mac Spotlight or Raycast.

---

## Non-Negotiable Rules

- Fully keyboard operable
- Works on every screen
- Works inside modals
- Executes real actions
- No visual redesign without system change
- Always part of keyboard-first workflow




## Global Shortcut System (Tally-Style Keyboard Standards)

This application must follow a strict keyboard-first workflow similar to Tally.  
Accountants should be able to operate the entire system without using a mouse.

These shortcut rules are global and must automatically apply to every new module, page, modal, and workflow without exception.

No module should be developed without implementing these shortcuts.

---

# Core Principles

1. Keyboard first. Mouse optional.
2. Every action must have a shortcut.
3. Shortcuts must remain consistent across all modules.
4. Same shortcut must always perform same action.
5. Never assign different actions to same key in different screens.
6. New modules must inherit shortcut system automatically.
7. Modals must follow same shortcut behavior as pages.

---

# Universal Global Shortcuts (Work Everywhere)

These must work on all screens including:
- Dashboard
- Invoices
- Payments
- Journal
- Chart of accounts
- Reports
- Settings
- Any modal
- Any AI panel

### Primary Actions

| Shortcut | Action |
|---------|--------|
| **Ctrl + S** | Save |
| **Ctrl + Shift + S** | Save and New |
| **Esc** | Cancel / Close / Go back |
| **Ctrl + Enter** | Save and close modal |
| **Alt + Enter** | Save and continue editing |
| **Ctrl + E** | Edit current record |
| **Ctrl + P** | Print |
| **Ctrl + Shift + P** | Export PDF |
| **Ctrl + Shift + E** | Email document |
| **Ctrl + D** | Duplicate record |
| **Del** | Delete selected record |
| **Ctrl + N** | Create new |
| **Ctrl + F** | Focus search |
| **Ctrl + Shift + F** | Advanced search |

---

# Navigation Shortcuts

| Shortcut | Action |
|---------|--------|
| **Esc** | Go back one level |
| **Alt + ←** | Previous screen |
| **Alt + →** | Next screen |
| **Ctrl + ←** | Previous record |
| **Ctrl + →** | Next record |
| **Tab** | Next field |
| **Shift + Tab** | Previous field |
| **Enter** | Confirm / move next |
| **Shift + Enter** | Move previous field |

---

# Record Management

| Shortcut | Action |
|---------|--------|
| **Ctrl + N** | New record |
| **Ctrl + S** | Save |
| **Ctrl + Shift + S** | Save & new |
| **Ctrl + E** | Edit mode |
| **Ctrl + D** | Duplicate |
| **Esc** | Cancel edit |
| **Ctrl + Backspace** | Clear form |

---

# Document Actions

Must work inside:
- Invoice
- Payment
- Journal
- Reports
- Any document screen

| Shortcut | Action |
|---------|--------|
| **Ctrl + P** | Print |
| **Ctrl + Shift + P** | Export PDF |
| **Ctrl + Shift + E** | Email |
| **Ctrl + Shift + X** | Export (general) |
| **Ctrl + I** | Preview |
| **Ctrl + Shift + W** | WhatsApp share (if exists) |

---

# Table & Grid Navigation

For all accounting grids:

| Shortcut | Action |
|---------|--------|
| **Enter** | Next cell |
| **Shift + Enter** | Previous cell |
| **Tab** | Next column |
| **Shift + Tab** | Previous column |
| **↑ ↓** | Move rows |
| **Ctrl + ↑** | Jump first row |
| **Ctrl + ↓** | Jump last row |
| **Alt + A** | Add new row |
| **Alt + D** | Delete row |
| **Ctrl + Enter** | Save grid |

---

# Modal Behavior Shortcuts

Every modal must support:

| Shortcut | Action |
|---------|--------|
| **Esc** | Close modal |
| **Ctrl + S** | Save |
| **Ctrl + Shift + S** | Save & new |
| **Enter** | Move next field |
| **Shift + Enter** | Previous field |

When modal opens:
- First input auto focus
- Keyboard ready instantly
- No click required

---

# AI & Navigation Shortcuts

| Shortcut | Action |
|---------|--------|
| **Windows + Space** | Open navigation modal |
| **F7** | Open StimesFi AI panel |
| **Ctrl + /** | Show shortcuts help |
| **Ctrl + K** | Command/search bar |

---

# Pagination & Data Navigation

When tables use pagination:

| Shortcut | Action |
|---------|--------|
| **Alt + →** | Next page |
| **Alt + ←** | Previous page |
| **Ctrl + Home** | First page |
| **Ctrl + End** | Last page |

---

# Form Entry Optimization (Tally-Style)

Forms must allow fast numeric entry.

Rules:
- Enter moves forward
- No mouse required
- Auto jump to next logical field
- Amount fields auto focus numeric input
- Dropdowns searchable by typing
- Typing filters instantly

---

# Visual Shortcut Hints

Every primary action button must show shortcut hint.

Example:
Save (Ctrl+S)  
Print (Ctrl+P)  
New (Ctrl+N)

Helps users learn shortcuts faster.

---

# Mandatory Development Rule

Every new module must automatically include:

- All global shortcuts
- Modal shortcuts
- Table shortcuts
- Navigation shortcuts
- AI shortcuts

No module should launch without shortcut support.

If any screen requires mouse to operate fully, it is considered a UX failure.

---

# Performance Requirement

Keyboard actions must be instant.

No delay.
No animation lag.
No blocked focus.
No keyboard trap.

System must feel like desktop accounting software.

Fast.
Direct.
Predictable.




# Advanced UI Density & Financial Visibility Standards

These rules are mandatory across all modules, forms, grids, and new developments.

They exist to optimize for high-volume accounting workflows and large dataset visibility.

Do not ignore or partially implement these rules.

---

# 1. Grid & Row Density Optimization (Compact Mode Standard)

Accounting users need maximum data visibility per screen.

## Mandatory Requirements

### Row Height
- Reduce row height across:
  - All tables
  - All editable grids
  - All allocation sections
  - All journal lines
  - All invoice items
- Target: visually compact but readable
- Remove unnecessary vertical padding
- Avoid oversized input fields

### Linear Structure
- Reduce whitespace between rows
- Reduce header-to-grid spacing
- Keep layout tight and aligned
- Avoid card-heavy stacking where grid is more efficient

### Typography Adjustment
- Maintain small font scale
- Use consistent compact line height
- Do not increase font size for aesthetic reasons

Goal:
Maximum data per screen without hurting readability.

---

# 2. Maximize / Expand Workspace (Required on All Forms)

All major forms must support a “Maximize Workspace” feature.

Applicable to:
- Invoice form
- Payment form
- Journal entry
- Chart of accounts
- Reports
- Any multi-section form

## Behavior

- Add a Maximize icon in form header
- On click:
  - Expand main content pane
  - Collapse sidebar if needed
  - Collapse AI panel optionally
  - Use full available width

Keyboard shortcut required:
- F11 → Toggle maximize mode

## Rules

- Must not break layout
- Must retain equal padding on all sides
- Must not create full-page scroll
- Grids must paginate instead of expanding vertically

---

# 3. Replace Standard Dropdowns (Modern Selection UX)

Standard long dropdown lists are not allowed for high-density workflows.

Replace with:

## A. Grouped Select Panels
For structured data:
- Account type
- Payment method
- Entry type
- Expense categories

Display grouped blocks instead of plain list.

## B. Clickable Selection Cards
For small-option choices:
- Cash vs Bank
- Debit vs Credit
- Draft vs Final
- Mode switches

Cards must:
- Highlight on selection
- Support arrow navigation
- Support Enter to confirm

## C. Searchable Command Select
For long datasets:
- Account selection
- Customer/vendor selection
- Cost center

Must support:
- Instant filtering
- Keyboard search
- Arrow navigation
- Enter select

Do not use legacy dropdown styling.

---

# 4. Financial Highlighting & Focus System

Financial visibility is critical.

The interface must visually emphasize financial context at all times.

## Auto Highlight During Data Entry

When user focuses:
- Amount field
- Tax field
- Allocation grid
- Charges section

The relevant financial summary must auto-highlight.

Example:
If editing invoice grid:
→ Subtotal section highlights

If editing tax:
→ VAT/GST summary highlights

If editing allocation:
→ Outstanding total highlights

## Required Financial Emphasis Areas

Always visually distinguish:
- Outstanding total
- Net amount
- Subtotal
- VAT / GST
- Final total
- Balance difference

Use:
- Slight background tint
- Accent border
- Strong typography
- Visual grouping

Never hide final totals below scroll.

They must always be visible or sticky.

---

# 5. Screen Size & Responsiveness Stability

Current design must not break on large screens.

## Large Screen Rules

- No stretched components
- No excessive whitespace
- Maintain max content width constraint
- Maintain balanced left-right layout
- Keep AI panel fixed width

## Small Laptop Rules

- No vertical page expansion
- Grid becomes horizontally scrollable if needed
- Pagination instead of height growth
- Preserve consistent padding

## Height Behavior

Never allow:
- Main page height increase when data grows
- AI panel pushing layout
- Uneven bottom padding

All screens must maintain:
- Fixed viewport height
- Internal scroll zones only

---

# 6. Input Focus Visibility (Mandatory)

When user enters a field:

- That field must visually highlight
- Surrounding section must subtly indicate context
- Financial impact zone must glow or accent

Focus state must be:
- Clear
- Strong
- Not subtle

Accountants must never wonder:
“Where am I editing?”

---

# 7. Universal Compact Mode Standard

All modules must follow compact density by default.

No separate “compact mode” toggle.

Default layout must already be optimized for:
- High data density
- Keyboard-first usage
- Maximum visible rows
- Fast scanning

---

# 8. Performance & Interaction Rules

- No layout shifts when switching modes
- No delayed resizing
- No animation-heavy transitions
- No content jumping

System must feel:
Stable
Fast
Linear
Accounting-focused

---

# 9. Non-Negotiable Enforcement

Every new module must:

- Reduce grid row heights
- Support maximize mode
- Replace basic dropdowns
- Highlight financial summaries
- Maintain fixed viewport height
- Work perfectly on max screen resolution

If any screen:
- Looks spaced out
- Feels empty
- Hides financial totals
- Requires scrolling full page

It fails the standard.


## Modal Border Radius Standard (Mandatory Consistency Rule)

All modals across the application must follow one consistent border radius rule.

No exceptions.

Currently some modals have no radius while others have rounded corners.  
This inconsistency must be corrected immediately.

---

# 1. Single Radius Token Only

All modals must use the same border radius value defined in the design system.

Do not:
- Use different radius per module
- Use sharp corners in some modals
- Use extra-large rounded corners in others

One system value only.

Example:
Modal border-radius = 12px  
(Or whatever the official system token is)

That same value must apply everywhere.

---

# 2. Scope of Application

This rule applies to:

- Create modals
- Edit modals
- View modals
- Navigation modal
- Confirmation dialogs
- Warning dialogs
- AI popups inside modals
- Nested modals

Everything must match.

---

# 3. Inner Sections Must Follow Same Radius Logic

Inside modals:

- Cards
- Panels
- Summary sections
- Allocation grids

Must use the system radius scale hierarchy.

Example:
Modal = 12px  
Inner card = 8px  
Inputs = 6px  

Do not randomly mix:
- Sharp inner containers
- Rounded outer containers

Hierarchy must feel intentional and uniform.

---

# 4. No Radius Mixing Rule

Do not combine:
- Square modal + rounded inner cards
- Rounded modal + square footer
- Different corner treatments per side

Corners must be symmetrical.

---

# 5. Footer and Header Alignment

Modal header and footer must align with modal radius.

If modal has rounded corners:
- Header background must respect radius
- Footer background must respect radius
- No visual corner clipping

---

# 6. Shadow Consistency

If modal uses shadow:
- Same shadow style across all modals
- No darker shadow in one module
- No flat style in another

Shadow + radius must feel unified.

---

# 7. Design Review Rule

Before releasing any new modal:

Checklist:
- Border radius matches system token
- No sharp corner mismatch
- Header/footer follow same radius logic
- Inner elements follow hierarchy scale

If not, it must be corrected before approval.

---

# Final Standard

All modals must look like they belong to the same product.

Consistent  
Intentional  
System-driven  
Not random  

If radius differs, it is considered a design system violation.

Every screen, panel, modal, drawer, table, and empty state must be fully responsive by default. There are no desktop-only exceptions.

---

# 21. Repository & Deployment Architecture

**Important:** The root of the Git repository for this project is the `erp-app` directory, NOT the parent workspace folder. This allows the application to be directly deployed from platforms like Vercel because the framework config and package.json are at the repository root.
If making commits or pushing code, ensure you are inside the `erp-app` directory where the local `.git` repository resides.

---

# 22. Navigation & Routing (Mandatory Rule)

Whenever a new page, module, or feature is created (e.g., Payments, Receipts, Reports):
1. **It MUST be added to the Left Navigation Bar.**
2. If it is an accounting feature, it **MUST be added under the `Accounting` menu** in `sidebar.component.ts`.
3. Never create "orphaned" pages that can only be accessed via keyboard shortcuts or hidden links. The left sidebar is the source of truth for all available modules.

---

# 23. Stimes Fi (AI Panel) Consistency

- **Always keep the same StimesFi AI layout for all modal boxes.**
- Instead of re-creating the AI sidebar from scratch in new modals, **reuse the existing `<app-ai-panel>` component** (usually from `src/app/features/ai-panel/ai-panel.component`).
- The expansion behavior should be consistent: the modal width expands to accommodate the fixed-width AI panel (`width: 320px`), and `border-left` separates the AI panel from the main content.

<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:

## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->