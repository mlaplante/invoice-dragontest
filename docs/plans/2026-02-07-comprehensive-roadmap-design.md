# Invoice Dragon: Comprehensive Improvement PRD & Roadmap

**Version:** 2.0
**Date:** February 7, 2026
**Status:** Proposed
**Supersedes:** PRD-UI-ENHANCEMENTS.md (v1.0, completed)

---

## Executive Summary

Invoice Dragon v1 is live and functional, but a production audit reveals **critical bugs blocking core functionality** alongside significant opportunities to evolve from a basic tool into a polished, reliable invoicing platform. This PRD defines 6 phases of work spanning bug fixes, reliability, UX improvements, and new features.

**Current Reality:** The PDF preview is broken in production (blank output, continuous `/undefined` 404 errors), the header logo doesn't render, and there is zero test coverage. The app works for simple flows but fails on edge cases and lacks the robustness users expect.

**Target State:** A reliable, tested, accessible invoicing app with invoice history, client management, and professional polish.

---

## Critical Production Issues (Found Feb 7, 2026)

These were discovered during a live audit of https://laplantedevinvoices.netlify.app:

| #   | Issue                                                       | Severity | Root Cause                                                                                                                                  |
| --- | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | PDF preview shows blank page with "undefined Invoice" title | P0       | `clientName` is undefined when no client info entered; logo Image component receives imported module object instead of URL string           |
| 2   | Continuous `/undefined` 404 requests (18+ per session)      | P0       | `logo` prop passes a Next.js image import object to `@react-pdf/renderer` `<Image>`, which expects a URL string. Falls back to `/undefined` |
| 3   | Header logo (SVG) not rendering visibly                     | P1       | `next/image` with SVG import may have sizing/display issues in the SCSS layout                                                              |
| 4   | Help & Support button does nothing                          | P1       | `onClick` handler is missing — button is decorative                                                                                         |
| 5   | "Settings" menu item is a no-op                             | P2       | `onClick={() => {}}` — placeholder never implemented                                                                                        |
| 6   | Mobile "More" dropdown overlaps content                     | P2       | Dropdown positioning CSS doesn't account for mobile viewport                                                                                |
| 7   | Download PDF button stays disabled                          | P2       | `disabled={!showPreview}` — can only download after previewing, but this isn't communicated to the user                                     |
| 8   | `confirm()` used for Clear Data instead of custom dialog    | P3       | Browser native dialog breaks immersion, not translatable                                                                                    |
| 9   | Analytics script blocked by ORB                             | P3       | Cross-origin script from different Netlify subdomain blocked                                                                                |

---

## Roadmap Overview

| Phase | Name                             | Focus                                                          | Effort    | Priority |
| ----- | -------------------------------- | -------------------------------------------------------------- | --------- | -------- |
| **1** | Emergency Fixes                  | Fix broken core functionality                                  | 1-2 days  | CRITICAL |
| **2** | Testing & Reliability            | Add test coverage, error boundaries, validation                | 1 week    | HIGH     |
| **3** | UX Polish                        | Fix remaining rough edges, improve interactions                | 1 week    | HIGH     |
| **4** | Accessibility & Performance      | WCAG 2.1 AA, performance monitoring, SEO                       | 3-4 days  | MEDIUM   |
| **5** | New Features: Invoice Management | Invoice history, drafts, client management                     | 1-2 weeks | MEDIUM   |
| **6** | New Features: Advanced           | Dark mode, custom branding, multi-page invoices, export/import | 2 weeks   | LOW      |

**Total estimated effort:** 5-8 weeks (solo developer)

---

## Phase 1: Emergency Fixes (1-2 days)

**Goal:** Make the core happy path work in production.

### 1.1 Fix PDF Logo Rendering (`/undefined` 404 spam)

**Problem:** The `logo` state is initialized with a Next.js static image import (`logoP`). When passed to `@react-pdf/renderer`'s `<Image>` component, it receives an object (`{ src, height, width }`) instead of a URL string, causing the renderer to request `/undefined`.

**Fix:**

- When `logoUpdated` is false, don't pass logo to PDF templates at all (or pass `null`)
- When `logoUpdated` is true, the logo is a base64 data URL from FileReader — this works correctly
- Add a guard in each Template component: only render `<Image>` when logo is a valid string

**Files:** `src/pages/templates.js`, `src/components/Preview/Templates/Template1-4.jsx`

**Acceptance Criteria:**

- [ ] Zero `/undefined` network requests in console
- [ ] PDF renders without logo when none uploaded
- [ ] PDF renders with logo when user uploads one
- [ ] "Not valid image extension" warnings eliminated

### 1.2 Fix PDF Preview Title ("undefined Invoice")

**Problem:** `<Document title={`${clientName} ${formName}`}>` — when `clientName` is undefined (no client info entered), the title becomes "undefined Invoice".

**Fix:** Default to empty string or a sensible fallback: `title={`${clientName || 'New'} ${formName}`}`

**Files:** `src/components/Preview/Preview.jsx`

**Acceptance Criteria:**

- [ ] Preview title shows "New Invoice" when no client name entered
- [ ] Preview title shows "ClientName Invoice" when entered

### 1.3 Fix Header Logo Visibility

**Problem:** The SVG logo imports correctly but doesn't render visibly — likely a CSS sizing or display issue.

**Fix:** Inspect the `header.module.scss` for the `.pageLogo` class. Ensure the Image has explicit width/height and the container isn't collapsing.

**Files:** `src/components/Header/Header.jsx`, `src/components/Header/header.module.scss`

**Acceptance Criteria:**

- [ ] Logo visible in header on both landing page and templates page
- [ ] Logo links to home page
- [ ] Proper sizing on mobile and desktop

### 1.4 Fix Mobile Dropdown Overlap

**Problem:** MoreMenu dropdown doesn't position correctly on mobile viewports.

**Fix:** Add `position: relative` to container, use `position: absolute; right: 0; bottom: 100%` (open upward on mobile) or ensure z-index is correct.

**Files:** `src/components/moreMenu.module.scss`

**Acceptance Criteria:**

- [ ] Dropdown doesn't overlap form content on mobile
- [ ] Menu is fully visible within viewport
- [ ] Click-outside dismissal still works

### 1.5 Wire Up Help & Support Button

**Problem:** Button has no onClick handler.

**Fix:** Add a simple action — either link to a help page/README, open a tooltip with keyboard shortcuts, or link to the GitHub repository.

**Files:** `src/components/Header/Header.jsx`

**Acceptance Criteria:**

- [ ] Button triggers a visible action (tooltip, link, or modal)
- [ ] Action is useful to the user

---

## Phase 2: Testing & Reliability (1 week)

**Goal:** Establish test infrastructure and add coverage for critical paths. Add error handling that prevents crashes.

### 2.1 Set Up Test Framework

**What:** Install and configure Jest + React Testing Library. Add test scripts to package.json. Configure CI to run tests.

**Files:** `package.json`, `jest.config.js`, `.github/workflows/test.yml`

**Acceptance Criteria:**

- [ ] `npm test` runs successfully
- [ ] `npm run test:coverage` generates coverage report
- [ ] CI pipeline runs tests on every push/PR
- [ ] Coverage thresholds configured (aim for 50% initially)

### 2.2 Unit Tests for Core Logic

**Priority test targets:**

| Component/Module     | Tests                             | Why                          |
| -------------------- | --------------------------------- | ---------------------------- |
| `utils/storage.js`   | save, load, clear, quota handling | Data persistence is critical |
| `Table` calculations | qty x rate = amount, total sum    | Financial accuracy matters   |
| `numberWithCommas()` | formatting edge cases             | Used in PDF output           |
| Currency selection   | code + symbol mapping             | Displayed on invoices        |

**Target:** 15-20 unit tests covering the above.

### 2.3 Integration Tests

**Priority flows:**

- Template selection -> form appears
- Form input -> PDF props update
- Logo upload -> preview shows logo
- Load Example Data -> form populates
- Clear Data -> form resets

**Target:** 8-10 integration tests.

### 2.4 Add Error Boundary

**What:** Wrap the app in a React Error Boundary that catches render errors and shows a recovery UI instead of a white screen.

**Files:** New `src/components/ErrorBoundary.jsx`, update `src/pages/_app.js`

**Acceptance Criteria:**

- [ ] Render errors show friendly "Something went wrong" UI
- [ ] User can click "Try Again" to reload
- [ ] Error details logged to console

### 2.5 Form Validation

**What:** Validate required fields before allowing PDF preview/download. Show inline errors.

**Required fields:**

- Business name (from section)
- Client name (bill to section)
- At least one line item with description and rate > 0

**Behavior:**

- Highlight missing required fields with red border
- Show error toast: "Please fill in required fields"
- Disable Preview/Download until minimum fields met

**Files:** `src/pages/templates.js`, `src/components/Form/Form.jsx`, `src/components/Form/form.module.scss`

**Acceptance Criteria:**

- [ ] Required fields marked with asterisk
- [ ] Red border on empty required fields when user tries to preview
- [ ] Toast error message explains what's missing
- [ ] Valid form enables Preview button

### 2.6 Replace `alert()` and `confirm()` with UI Components

**What:** Replace browser-native `alert()` (file upload errors) and `confirm()` (clear data) with styled modal/dialog components that match the app design and are translatable.

**Files:** New `src/components/ConfirmDialog/ConfirmDialog.jsx`, update `src/pages/templates.js`

**Acceptance Criteria:**

- [ ] Confirmation dialog for "Clear Saved Data" matches app styling
- [ ] Dialog has Cancel (secondary) and Confirm (danger red) buttons
- [ ] File upload errors show via Toast instead of alert()
- [ ] All dialog text uses i18n translation keys

---

## Phase 3: UX Polish (1 week)

**Goal:** Smooth out the user experience with better feedback, navigation, and interaction patterns.

### 3.1 Improve Download PDF Flow

**Problem:** Download button is disabled until preview is shown, but this isn't explained. Users may want to download without previewing.

**Fix:**

- Allow PDF download without requiring preview first
- Show a brief loading state on the download button while PDF generates
- Add tooltip on disabled state explaining why (if keeping the constraint)

**Files:** `src/pages/templates.js`

**Acceptance Criteria:**

- [ ] User can download PDF directly after filling form (no preview required) OR
- [ ] Clear visual indicator that preview is needed first with message

### 3.2 Implement Settings Panel

**Problem:** Settings menu item exists but does nothing.

**What:** Create a settings panel with:

- Default currency preference (persisted)
- Default language preference (already works via selector)
- Invoice number auto-increment toggle
- Default notes/terms text
- Data export (download JSON of saved data)
- Data import (upload JSON to restore data)

**Files:** New `src/components/Settings/Settings.jsx`, `src/utils/storage.js`

**Acceptance Criteria:**

- [ ] Settings panel opens from MoreMenu
- [ ] Preferences persist across sessions
- [ ] Export produces a downloadable JSON file
- [ ] Import restores saved state

### 3.3 Keyboard Shortcuts

**What:** Add common keyboard shortcuts for power users.

| Shortcut       | Action                                   |
| -------------- | ---------------------------------------- |
| `Ctrl/Cmd + P` | Preview invoice                          |
| `Ctrl/Cmd + S` | Save (triggers manual save confirmation) |
| `Ctrl/Cmd + D` | Download PDF                             |
| `Escape`       | Close preview / close modal              |

**Files:** `src/pages/templates.js` (useEffect for keydown listener)

**Acceptance Criteria:**

- [ ] Shortcuts work on both Mac and Windows
- [ ] Shortcuts don't conflict with browser defaults
- [ ] Shortcuts visible in Help tooltip

### 3.4 Improve Landing Page

**Problem:** Landing page is too sparse — single hero section with empty space below.

**What:** Add below the hero:

- Feature highlights (3 cards: "Free & Private", "Professional Templates", "Multi-Language")
- How it works (3 steps: Choose Template -> Fill Details -> Download PDF)
- Simple footer with links

**Files:** `src/pages/index.js`, `src/components/Home/HomePage.jsx`, styles

**Acceptance Criteria:**

- [ ] Landing page has content below the fold
- [ ] Features section explains key value props
- [ ] How-it-works section sets user expectations
- [ ] Footer with GitHub link and credits

### 3.5 Better Empty States

**What:** When the form is first shown (no data entered), show helpful placeholder content.

- Placeholder text in all fields showing example values
- "Tip" banner at top: "Start by entering your company info — it'll be saved for next time"
- Subtle animation drawing attention to the first field

**Files:** `src/components/Form/Form.jsx`, locale files

**Acceptance Criteria:**

- [ ] All fields have descriptive placeholder text
- [ ] First-visit tip banner is dismissible
- [ ] Placeholders are translated in all 6 languages

---

## Phase 4: Accessibility & Performance (3-4 days)

**Goal:** Meet WCAG 2.1 AA standards and establish performance baselines.

### 4.1 Accessibility Audit & Fixes

**Known issues to fix:**

- Form `<input>` elements missing associated `<label>` elements (use `htmlFor`)
- Focus indicators not visible on all interactive elements
- Dropdown menus don't trap focus (tab escapes the menu)
- No `aria-invalid` on validation error fields
- Color contrast not verified against 4.5:1 ratio
- MoreMenu and CurrencySelector dropdowns need keyboard navigation (Arrow keys)

**Process:**

1. Run Lighthouse accessibility audit
2. Run axe DevTools scan
3. Test keyboard-only navigation flow
4. Test with VoiceOver (macOS)
5. Fix all issues found

**Acceptance Criteria:**

- [ ] Lighthouse Accessibility score > 90
- [ ] All form inputs have associated labels
- [ ] Visible focus indicators on all interactive elements
- [ ] Dropdown menus navigable with Arrow keys + Enter + Escape
- [ ] Color contrast ratio > 4.5:1 for all text
- [ ] Screen reader announces dynamic content changes

### 4.2 Performance Optimization

**What:**

- Replace standard `<img>` tags with `next/image` for template previews (automatic optimization)
- Add `React.memo` to expensive child components (Template selector, Table rows)
- Lazy load the MoreMenu and Settings components
- Add Web Vitals tracking (report to console or analytics)
- Measure and optimize bundle size

**Acceptance Criteria:**

- [ ] Lighthouse Performance score > 85
- [ ] Template preview images served as WebP
- [ ] No unnecessary re-renders on form input (verify with React DevTools Profiler)
- [ ] Bundle size documented in CI output

### 4.3 SEO & Meta Tags

**What:**

- Fix `<meta name="description">` (currently says "Generated by create next app")
- Add Open Graph tags for social sharing
- Add structured data (JSON-LD) for the tool
- Proper `<title>` tags per page

**Files:** `src/pages/index.js`, `src/pages/templates.js`, `src/pages/_document.js`

**Acceptance Criteria:**

- [ ] Unique, descriptive meta descriptions per page
- [ ] Open Graph image for social sharing
- [ ] Clean URL previews when shared on social media

---

## Phase 5: Invoice Management Features (1-2 weeks)

**Goal:** Transform from a one-shot tool into a productivity platform.

### 5.1 Invoice History & Drafts

**What:** Save generated invoices to localStorage with metadata. Allow users to view, edit, and re-download past invoices.

**Data model:**

```json
{
  "invoices": [
    {
      "id": "inv-uuid",
      "createdAt": "2026-02-07T12:00:00Z",
      "updatedAt": "2026-02-07T12:30:00Z",
      "status": "draft|completed",
      "formData": { ... },
      "rows": [ ... ],
      "template": "template1",
      "currency": { "code": "USD", "symbol": "$" },
      "total": "2,800.00"
    }
  ]
}
```

**UI:**

- "My Invoices" tab/page showing saved invoices as cards
- Each card shows: client name, total, date, status badge
- Click to edit (loads data back into form)
- Delete with confirmation
- Duplicate invoice (create copy for new month)

**Files:** New `src/pages/invoices.js`, New `src/components/InvoiceHistory/`, `src/utils/storage.js`

**Acceptance Criteria:**

- [ ] Invoices auto-save as drafts while editing
- [ ] Completed invoices saved when PDF downloaded
- [ ] History page shows all saved invoices
- [ ] Can resume editing a draft
- [ ] Can duplicate an invoice
- [ ] Can delete an invoice (with confirmation)
- [ ] Storage limit handling (warn when approaching 5MB)

### 5.2 Client Management

**What:** Save client details for quick reuse across invoices.

**Data model:**

```json
{
  "clients": [
    {
      "id": "client-uuid",
      "name": "Future Client Inc.",
      "email": "contact@futureclient.com",
      "address": "456 Opportunity Ave",
      "city": "Business Bay",
      "zipcode": "11111",
      "phone": "(555) 987-6543",
      "invoiceCount": 3,
      "lastUsed": "2026-02-07T12:00:00Z"
    }
  ]
}
```

**UI:**

- "Select Client" dropdown in the Bill To section
- Autocomplete as user types client name
- "Save as new client" checkbox when entering new client info
- Client list in Settings panel

**Files:** New `src/components/ClientSelector/`, `src/utils/storage.js`, `src/components/Form/Form.jsx`

**Acceptance Criteria:**

- [ ] Previously used clients appear in dropdown
- [ ] Selecting a client auto-fills Bill To fields
- [ ] New clients can be saved during invoice creation
- [ ] Clients can be edited/deleted from Settings
- [ ] Client data persists across sessions

### 5.3 Invoice Numbering

**What:** Auto-generate sequential invoice numbers with configurable format.

**Formats:**

- `INV-2026-001` (default)
- `INV-001`
- Custom prefix + number

**Behavior:**

- Auto-increment from last used number
- User can override manually
- Format configurable in Settings

**Files:** `src/utils/invoiceNumber.js`, `src/pages/templates.js`, Settings panel

**Acceptance Criteria:**

- [ ] Invoice number auto-populates on new invoice
- [ ] Number increments from last used
- [ ] Format configurable in Settings
- [ ] Manual override always available

---

## Phase 6: Advanced Features (2 weeks)

**Goal:** Differentiate Invoice Dragon with premium-feeling features.

### 6.1 Dark Mode

**What:** Toggle between light and dark themes. Respect system preference by default.

**Approach:**

- CSS custom properties (variables) for all colors
- `prefers-color-scheme` media query for auto-detection
- Manual toggle in Settings
- Persist preference in localStorage

**Files:** `src/styles/design-system.scss` (add dark theme variables), `src/pages/_app.js`

**Acceptance Criteria:**

- [ ] Dark mode toggle in Settings
- [ ] Respects system preference on first visit
- [ ] All components readable in both themes
- [ ] PDF preview unaffected (always light)
- [ ] Smooth transition between themes

### 6.2 Custom Invoice Branding

**What:** Let users customize invoice colors and fonts beyond template selection.

**Options:**

- Primary accent color (header, highlights)
- Secondary color (details, borders)
- Font selection (3-4 options)

**UI:** Color pickers and font selector in a "Branding" section of the form or Settings.

**Files:** Template components, Settings panel

**Acceptance Criteria:**

- [ ] Color changes reflect immediately in preview
- [ ] Custom colors saved per-invoice
- [ ] Sensible defaults that look professional
- [ ] Color validation (ensure readability)

### 6.3 Multi-Page Invoice Support

**What:** Invoices with many line items should flow to additional pages automatically.

**Current issue:** Long invoices may overflow the single page or get cut off.

**Fix:** `@react-pdf/renderer` supports multi-page documents natively — ensure templates handle page breaks gracefully with repeated headers/footers.

**Files:** `src/components/Preview/Templates/Template1-4.jsx`

**Acceptance Criteria:**

- [ ] 20+ line items flow to second page cleanly
- [ ] Page numbers shown: "Page 1 of 2"
- [ ] Company header repeated on each page
- [ ] Totals always on last page

### 6.4 Receipt Mode

**What:** Toggle between Invoice and Receipt format. Receipts have simpler layout with "PAID" stamp and payment details.

**What changes:**

- "PAID" watermark or stamp
- Payment method field
- Payment date field
- Simplified layout (no "due date")

**Files:** Templates, Form component, new receipt-specific fields

**Acceptance Criteria:**

- [ ] Toggle between Invoice/Receipt at top of form
- [ ] Receipt shows "PAID" indicator on PDF
- [ ] Relevant fields change based on mode
- [ ] Both modes work with all 4 templates

### 6.5 Data Export & Backup

**What:** Export all app data (invoices, clients, settings) as a JSON file. Import to restore.

**Files:** `src/utils/storage.js`, Settings panel

**Acceptance Criteria:**

- [ ] "Export All Data" button in Settings
- [ ] Downloads a timestamped JSON file
- [ ] "Import Data" accepts the JSON file
- [ ] Import merges or replaces (user choice)
- [ ] Validation on import (reject invalid data)

---

## Technical Debt to Address Throughout

These items should be resolved opportunistically as you work on each phase:

| Item                                                            | Where                                         | Phase to Address |
| --------------------------------------------------------------- | --------------------------------------------- | ---------------- |
| Remove unused `api/hello.js`                                    | `src/pages/api/`                              | Phase 1          |
| Duplicated `numberWithCommas()` in templates.js and Preview.jsx | Extract to utils                              | Phase 2          |
| Prop drilling 20+ props through Preview/PDF/Templates           | Consider a form context or single data object | Phase 3          |
| `Font.register()` called inside render in Template components   | Move to module scope                          | Phase 2          |
| No PropTypes or TypeScript on any component                     | Add PropTypes incrementally                   | Phase 2+         |
| Commented-out code (`// const [service, setService]`)           | Clean up                                      | Phase 1          |
| Hardcoded "Settings" string in MoreMenu (not translated)        | Add to locale files                           | Phase 1          |
| `logoP` imported but only used as fallback                      | Simplify to null/undefined pattern            | Phase 1          |
| Meta description says "Generated by create next app"            | Fix in Phase 4                                | Phase 4          |

---

## Success Metrics

| Metric                        | Current          | Phase 2 Target | Phase 4 Target | Phase 6 Target |
| ----------------------------- | ---------------- | -------------- | -------------- | -------------- |
| Console errors on load        | 18+ `/undefined` | 0              | 0              | 0              |
| Test coverage                 | 0%               | 50%            | 65%            | 75%            |
| Lighthouse Accessibility      | Unknown          | > 70           | > 90           | > 95           |
| Lighthouse Performance        | Unknown          | > 70           | > 85           | > 90           |
| Form completion rate          | Unknown          | Tracked        | > 80%          | > 85%          |
| PDF downloads/visit           | Unknown          | Tracked        | > 15%          | > 25%          |
| Saved invoices (localStorage) | N/A              | N/A            | N/A            | Functional     |
| Saved clients                 | N/A              | N/A            | N/A            | Functional     |

---

## Risk Register

| Risk                                                        | Likelihood | Impact | Mitigation                                                   |
| ----------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------ |
| localStorage hitting 5MB limit with invoice history + logos | High       | Medium | Compress logo data, warn users at 80% capacity, offer export |
| @react-pdf/renderer breaking changes on update              | Medium     | High   | Pin version, test PDF output in CI                           |
| Accessibility fixes breaking existing layout                | Medium     | Medium | Visual regression testing before/after                       |
| Dark mode causing readability issues in edge cases          | Medium     | Low    | Thorough testing, fallback to light mode                     |
| Multi-page invoices rendering differently across browsers   | Low        | Medium | Cross-browser PDF preview testing                            |
| TypeScript migration causing build issues                   | Medium     | Medium | Incremental migration, strict mode off initially             |

---

## Decision Log

| Decision                                 | Rationale                                                                                 | Alternatives Considered                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Keep localStorage (no backend)           | Core value prop is privacy/no-account. Adding a backend changes the product fundamentally | IndexedDB (more storage but more complexity), Supabase (adds auth requirement) |
| Fix bugs before new features             | Users can't use the app if PDF preview is broken                                          | Ship features in parallel (risky)                                              |
| Jest over Vitest                         | More ecosystem support, better Next.js integration                                        | Vitest (faster but less mature Next.js support)                                |
| PropTypes over TypeScript migration      | Lower effort, less risk of build breakage                                                 | Full TS migration (better long-term but 1+ week of work)                       |
| Settings in MoreMenu (not separate page) | Keeps the single-page feel, less navigation                                               | Dedicated /settings route                                                      |

---

## Implementation Order (Recommended)

```
Phase 1 (Days 1-2)     -> Ship immediately, unblocks everything
  |
Phase 2 (Days 3-9)     -> Foundation for safe future changes
  |
Phase 3 (Days 10-16)   -> User-facing improvements
  |
Phase 4 (Days 17-20)   -> Quality bar
  |
Phase 5 (Days 21-30)   -> Feature expansion
  |
Phase 6 (Days 31-45)   -> Differentiation
```

Each phase should end with a tagged release and deployment to production.

---

**Prepared by:** Claude Opus 4.6
**Date:** February 7, 2026
**Next review:** After Phase 2 completion
