# Product Requirements Document: Invoice Dragon UI/UX Enhancements

**Document Version:** 1.0
**Date Created:** February 6, 2026
**Status:** Proposed
**Priority:** High
**Estimate:** 3-4 weeks (phased approach)

---

## Executive Summary

Invoice Dragon has strong core functionality but requires UI/UX improvements to enhance user engagement, reduce friction, and provide a more professional appearance. This PRD outlines prioritized enhancements across three phases, focusing on accessibility, mobile responsiveness, visual hierarchy, and user feedback.

**Current State:** Functional but needs polish
**Target State:** Professional, intuitive, responsive invoicing app
**Key Stakeholders:** Users (SMBs), Developers, Product Owner

---

## Problem Statement

### Current Usability Issues

1. **Broken Template Previews** - Users cannot see template designs before selecting
2. **Mobile Experience** - Two-column layout breaks on small screens, forms are cramped
3. **Form Overload** - Too many fields without clear grouping or visual separation
4. **Weak Visual Feedback** - No indication when template is selected, no status messages
5. **Confusing Actions** - "Download PDF" button disabled, unclear why; dangerous "Clear Data" button sits with safe actions
6. **Poor Line Items UX** - Table is cramped, hard to add/remove items, unclear how to interact

### User Impact

- Users abandon form due to perceived complexity
- Mobile users have poor experience
- Users can't verify selections before proceeding
- Data entry errors go unnoticed
- Accidental data deletion risk

### Business Impact

- Low conversion rate from landing page
- Negative user feedback/reviews
- Lost mobile market opportunity
- Support burden from confused users

---

## Goals & Success Metrics

### Goals

1. **Improve User Experience** - Make form intuitive and scannable
2. **Enable Mobile Usage** - 50%+ traffic from mobile devices
3. **Increase Conversions** - Get users to successfully generate PDFs
4. **Professional Polish** - Match market expectations for modern web apps
5. **Accessibility** - WCAG 2.1 AA compliance

### Success Metrics

| Metric                           | Current     | Target | Timeline      |
| -------------------------------- | ----------- | ------ | ------------- |
| Mobile Bounce Rate               | Unknown     | <30%   | After Phase 2 |
| Form Completion Rate             | Unknown     | >80%   | After Phase 1 |
| PDF Downloads/Visit              | Unknown     | >15%   | After Phase 2 |
| Time to Generate PDF             | Unknown     | <2 min | Ongoing       |
| Accessibility Score (Lighthouse) | Unknown     | >90    | After Phase 3 |
| User Satisfaction (NPS)          | Not tracked | >40    | After Phase 3 |

---

## Requirements by Phase

## 🔴 PHASE 1: Critical Fixes (1-2 weeks)

**Objective:** Fix broken functionality and core UX issues
**Priority:** Must-have
**Effort:** 40-60 hours

### 1.1 Fix Template Preview Images

**Current State:** Template images return 404 errors, users see broken images
**Required Behavior:**

```
WHEN user visits template selection page
THEN template images should load successfully
OR show a descriptive fallback with template name and description
```

**Acceptance Criteria:**

- [ ] All 4 template preview images load without errors
- [ ] No 404 errors in console
- [ ] If image fails to load, show template name + description
- [ ] Template selection still works even without images

**Implementation Notes:**

- Verify image paths in deployment
- Check Netlify configuration
- Add fallback text: "Professional", "Modern", "Minimalist", "Simple"
- Test on slow network (Network throttle: "Slow 4G")

**Files to Update:**

- `src/components/InvoiceTemplate/InvoiceTemplate.jsx`
- `src/components/Preview/Templates/` (if using next/image)
- `.github/workflows/test.yml` (add image validation)

---

### 1.2 Improve Form Section Grouping & Clarity

**Current State:** Form fields are visually flat, no clear separation between sections
**Required Behavior:**

```
WHEN user views the form
THEN they should see clear visual grouping:
  - "From" section in one container
  - "Bill To" section in another container
  - Invoice details in another container
  - Line items in another container
  - Notes in another container
```

**Acceptance Criteria:**

- [ ] Each section has distinct visual container (background color or border)
- [ ] Section headings are prominent (larger, bold, or icon)
- [ ] All fields within a section are clearly grouped
- [ ] Spacing between sections is consistent (24px)
- [ ] Color coding: From (blue bg), Bill To (green bg), Details (neutral), Items (white)

**Design Specifications:**

```
From Section:
  - Background: rgba(59, 130, 246, 0.05) - light blue
  - Border: 1px solid #bfdbfe
  - Padding: 16px
  - Border-radius: 8px
  - Heading: "📧 From (Your Company)" - 16px bold, #1e40af

Bill To Section:
  - Background: rgba(34, 197, 94, 0.05) - light green
  - Border: 1px solid #bbf7d0
  - Padding: 16px
  - Border-radius: 8px
  - Heading: "👤 Bill To (Client)" - 16px bold, #15803d

Invoice Details Section:
  - Background: rgba(209, 213, 219, 0.3) - light gray
  - Border: 1px solid #d1d5db
  - Padding: 16px
  - Border-radius: 8px
  - Heading: "📋 Invoice Details" - 16px bold, #374151
```

**Implementation Notes:**

- Update `src/components/Form/Form.jsx` to add container elements
- Create new SCSS module with container styles
- Ensure accessibility: use `<section>` and proper heading hierarchy
- Mobile: Keep same visual separation (containers full width)

---

### 1.3 Better Currency & Language Selector Styling

**Current State:** Dropdowns are standard HTML, hard to find in top-right
**Required Behavior:**

```
WHEN user wants to select currency or language
THEN selectors should be:
  - Visually distinct and easy to find
  - Show current selection clearly (with icons)
  - Have good hover/active states
```

**Acceptance Criteria:**

- [ ] Language selector shows flag icon + language name
- [ ] Currency selector shows currency code + symbol (e.g., "USD $")
- [ ] Both selectors have visible labels or icons
- [ ] Hover state: background color changes, subtle shadow
- [ ] Active/selected state: bold text, highlight color
- [ ] Mobile: Touch-friendly size (min 44px height)

**Design Specifications:**

```
Language Selector:
  - Label: 🌐 (globe icon)
  - Display: "en (English)" selected as default
  - Options:
    - 🇬🇧 English
    - 🇫🇷 Français
    - 🇪🇸 Español
    - 🇵🇹 Português
    - 🇩🇪 Deutsch
    - 🇳🇱 Nederlands

Currency Selector:
  - Label: 💱 (currency icon)
  - Display: "USD ($)" selected as default
  - Show symbol next to amounts in form
  - Include: USD, EUR, GBP, CAD, AUD, JPY, etc.
```

**Implementation Notes:**

- Create new `LanguageSelector.jsx` component
- Create new `CurrencySelector.jsx` component
- Update header styling (`src/components/Header/Header.jsx`)
- Add flag emoji or use flag icons library (optional)
- Test on all screen sizes

---

### 1.4 Move "Clear Saved Data" to Settings/Safety

**Current State:** "Clear Saved Data" button sits next to "Download PDF" (risky UX)
**Required Behavior:**

```
WHEN user wants to clear saved data
THEN they should:
  1. Access a settings/more menu (three-dot icon)
  2. See a clear warning before deletion
  3. Optionally export data before clearing
```

**Acceptance Criteria:**

- [ ] "Clear Saved Data" moved to overflow menu or settings
- [ ] Confirmation dialog appears before clearing (with warning)
- [ ] Dialog shows: "This will delete all saved company info. Continue?"
- [ ] Dialog has Cancel and Confirm (in red) buttons
- [ ] Success message shown: "✓ All data cleared"

**UI Changes:**

```
Current:
[Preview] [Download PDF] [USD $] [Clear Saved Data]

New:
[Preview] [Download PDF] [USD $] [⋮ More]
                                     ├─ Settings
                                     └─ Clear Data...
```

**Implementation Notes:**

- Update `src/pages/templates.js` actions section
- Create `src/components/MoreMenu.jsx` or use existing dropdown
- Add confirmation dialog component
- Ensure keyboard accessible (Tab, Enter to confirm)

---

## 🟡 PHASE 2: High-Priority Enhancements (1-2 weeks)

**Objective:** Improve form UX, mobile experience, and visual feedback
**Priority:** Should-have
**Effort:** 50-80 hours

### 2.1 Enhance Line Items Table UX

**Current State:** Table is cramped, description field too small, no clear "Add Item" button
**Required Behavior:**

```
WHEN user wants to add/edit line items
THEN they should:
  1. See clear row separation
  2. Have prominent description field (textarea)
  3. See large "Add Item" button
  4. Have clear delete buttons
  5. See running subtotal
```

**Acceptance Criteria:**

- [ ] Description field is textarea style (min 60px height)
- [ ] Rows have 12px padding and 1px bottom border
- [ ] Row hover: light background color (rgba(59, 130, 246, 0.05))
- [ ] "Add Item" button is prominent (blue, 40px height) with + icon
- [ ] Delete button is red/warning color with X icon
- [ ] Subtotal updates in real-time as user types
- [ ] Mobile: Stack cells vertically (1 column layout)

**Table Layout:**

Desktop View:

```
┌─────────────────────────────────────────────────────────┐
│ [X] │ Description              │ Rate   │ Qty │ Amount  │
├─────────────────────────────────────────────────────────┤
│ [✕] │ [Large textarea]         │ 0.00   │ 1   │ $0.00   │
│     │ Additional details...    │        │     │         │
├─────────────────────────────────────────────────────────┤
│ [✕] │ [Large textarea]         │ 0.00   │ 1   │ $0.00   │
│     │ Additional details...    │        │     │         │
├─────────────────────────────────────────────────────────┤
│                                        Subtotal: $0.00   │
└─────────────────────────────────────────────────────────┘

[+ Add Item]
```

Mobile View:

```
┌────────────────────────────────────────┐
│ Item 1                           [✕]   │
├────────────────────────────────────────┤
│ Description:                           │
│ [Large textarea]                       │
│                                        │
│ Details: [Additional details...]       │
│                                        │
│ Rate: [0.00] │ Qty: [1] │ $0.00       │
└────────────────────────────────────────┘

[+ Add Item]
```

**Implementation Notes:**

- Update `src/components/Table/Table.jsx`
- Refactor row as component for better reusability
- Add textarea for description field
- Real-time calculation of subtotal
- Test with many items (10+) for performance

---

### 2.2 Responsive Mobile Layout

**Current State:** Form and sidebar stack vertically on mobile, poor UX
**Required Behavior:**

```
WHEN user is on mobile device
THEN layout should adapt:
  - Desktop (1200px+): 2-column (form + sidebar)
  - Tablet (768px-1200px): 1.5-column or responsive
  - Mobile (<768px): 1-column, sidebar becomes sticky footer
```

**Acceptance Criteria:**

- [ ] Mobile: Form takes 100% width, no horizontal scroll
- [ ] Mobile: Sidebar actions become sticky footer bar
- [ ] Mobile: Buttons are full-width and 44px+ height
- [ ] Tablet: Form wider, sidebar narrower but visible
- [ ] Landscape: Consider horizontal layout or adjust spacing
- [ ] No element exceeds 100vw on any device
- [ ] All inputs have min-height of 44px (touch target)

**Breakpoints:**

```
Mobile:    < 640px (form 100%, sidebar footer)
Tablet:    640px - 1024px (responsive grid)
Desktop:   > 1024px (current 2-column)
Large:     > 1400px (wider form, better spacing)
```

**Mobile Footer Actions:**

```
┌─────────────────────────────────────┐
│ [Preview] [Download] [⋮ More]       │
└─────────────────────────────────────┘
```

**Implementation Notes:**

- Use CSS media queries (already has `react-responsive`)
- Refactor grid layout in `src/pages/templates.js`
- Test on real mobile devices (iPhone, Android)
- Ensure bottom buttons don't hide content (sticky footer)
- Consider collapsible sections on mobile

---

### 2.3 Add Visual Feedback & Loading States

**Current State:** No indication when preview is loading, no save confirmation
**Required Behavior:**

```
WHEN user takes action
THEN they should receive immediate feedback:
  1. Loading spinner on async operations
  2. Toast notification on success/error
  3. Input focus indication
  4. Save confirmation message
```

**Acceptance Criteria:**

- [ ] "Preview Invoice" shows spinner while loading (2-3 seconds)
- [ ] Toast notification shows when data is saved (3-5 second fade)
- [ ] Error messages appear for invalid inputs (required fields)
- [ ] Success message: "✓ Company info saved automatically"
- [ ] Form fields show focus indicator (blue outline/shadow)
- [ ] Disabled buttons have 50% opacity
- [ ] All notifications are accessible (announceRole="status")

**Toast Design:**

```
Success (green background):
┌──────────────────────────────────┐
│ ✓ Company info saved automatically│
└──────────────────────────────────┘

Error (red background):
┌──────────────────────────────────┐
│ ⚠ Please fill in all required     │
│   fields marked with *            │
└──────────────────────────────────┘

Loading (blue background):
┌──────────────────────────────────┐
│ ⏳ Generating PDF preview...       │
└──────────────────────────────────┘
```

**Implementation Notes:**

- Create `Toast.jsx` component
- Add to `_app.js` or context provider
- Integrate with existing localStorage save
- Show after 500ms debounce (don't spam)
- Test accessibility with screen reader

---

### 2.4 Improve Template Selection UX

**Current State:** Template names not shown, selection indicator subtle
**Required Behavior:**

```
WHEN user selects a template
THEN they should see:
  1. Template name/description
  2. Clear selection indicator
  3. Difficulty or features of template
```

**Acceptance Criteria:**

- [ ] Each template shows name below image: "Professional", "Modern", "Minimalist", "Simple"
- [ ] Selected template has: glowing border (4px solid #3b82f6), or shadow
- [ ] Hover state: subtle shadow lift, cursor pointer
- [ ] Template card includes: image (larger preview), name, brief description
- [ ] "Selected" badge appears on chosen template
- [ ] On mobile: 2-column grid instead of 4

**Template Card Design:**

```
Desktop (4 columns):
┌──────────────┐
│  ┌────────┐  │
│  │ Image  │  │
│  │(bigger)│  │
│  └────────┘  │
│ Professional │
│  Clean layout│
│  for invoices│
└──────────────┘

Mobile (2 columns):
┌──────────────┬──────────────┐
│  ┌────────┐  │  ┌────────┐  │
│  │ Image  │  │  │ Image  │  │
│  │ Bigger │  │  │ Bigger │  │
│  └────────┘  │  └────────┘  │
│ Professional │  Modern      │
└──────────────┴──────────────┘
```

**Implementation Notes:**

- Update `src/components/InvoiceTemplate/InvoiceTemplate.jsx`
- Add template descriptions to i18n
- Improve image size (larger previews)
- Consider image optimization (next/image)

---

### 2.5 Improve Header/Navigation

**Current State:** Minimal header, no breadcrumbs or context
**Required Behavior:**

```
WHEN user is on any page
THEN header should show:
  1. Logo (clickable to home)
  2. Page context/breadcrumbs
  3. Language selector
  4. Help/support link
```

**Acceptance Criteria:**

- [ ] Logo is clickable, links to home
- [ ] Breadcrumb shown: "Home > Create Invoice"
- [ ] Mobile: Hide breadcrumb, show only logo + language
- [ ] Help icon with tooltip on desktop
- [ ] All header elements properly aligned and spaced
- [ ] Header is sticky (stays at top while scrolling)

**Header Design:**

```
Desktop:
┌─────────────────────────────────────────────┐
│ 🏠 Logo  Invoice Dragon › Create Invoice     │
│                          🌐 Language | Help │
└─────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────┐
│ 🏠 Logo                    🌐 [Language] │?│
└─────────────────────────────────────────────┘
```

**Implementation Notes:**

- Update `src/components/Header/Header.jsx`
- Add breadcrumb component or use simple text
- Make logo responsive
- Consider sticky positioning (CSS position:sticky)

---

## 🟢 PHASE 3: Polish & Advanced (2 weeks)

**Objective:** Visual polish, accessibility, advanced features
**Priority:** Nice-to-have
**Effort:** 40-60 hours

### 3.1 Visual Polish & Design System

**Requirements:**

- [ ] Add subtle drop shadows to cards and buttons
- [ ] Use consistent border-radius (8px for cards, 6px for buttons)
- [ ] Smooth transitions (0.2s ease) for all hover states
- [ ] Color scheme refinement (consider modern palette)
- [ ] Consistent spacing (8px grid system)
- [ ] Better button hierarchy (primary, secondary, danger)

**Button Styles:**

```
Primary (blue):
  - Background: #3b82f6
  - Hover: #2563eb
  - Active: #1d4ed8

Secondary (gray):
  - Background: #e5e7eb
  - Hover: #d1d5db
  - Active: #9ca3af

Danger (red):
  - Background: #ef4444
  - Hover: #dc2626
  - Active: #b91c1c
```

---

### 3.2 Accessibility Improvements (WCAG 2.1 AA)

**Requirements:**

- [ ] Keyboard navigation works throughout (Tab order)
- [ ] Color contrast ratio > 4.5:1 for text
- [ ] Focus indicators clearly visible
- [ ] Form labels properly associated with inputs
- [ ] ARIA labels for icon-only buttons
- [ ] Announcements for dynamic content (status role)
- [ ] Test with screen readers (NVDA, JAWS)
- [ ] Lighthouse Accessibility score > 90

**Implementation:**

- Audit with axe DevTools
- Test with keyboard only (no mouse)
- Test with screen reader
- Fix all WCAG violations

---

### 3.3 Company Logo Upload Improvement

**Current State:** Placeholder shown, unclear how to upload
**Requirements:**

- [ ] Show clear upload area with icon/text
- [ ] Drag-and-drop support
- [ ] File validation (image only, < 5MB)
- [ ] Preview of uploaded logo
- [ ] "Remove Logo" button
- [ ] Loading state while processing
- [ ] Error messages for invalid files

---

### 3.4 Empty State & Onboarding

**Requirements:**

- [ ] When form is empty, show tips/examples
- [ ] First-time user sees helpful hints
- [ ] Step indicators: "Step 1 of 3"
- [ ] Placeholder text examples in each field
- [ ] Tutorial tooltip (optional, dismissible)
- [ ] "Load Example Data" button for demo

---

### 3.5 Advanced Settings/Preferences

**Requirements:**

- [ ] Settings panel (gear icon)
- [ ] Options: default currency, language, theme
- [ ] Invoice numbering format
- [ ] Default terms/notes
- [ ] Export/import saved data
- [ ] Dark mode support (optional)

---

## Technical Implementation Notes

### Stack & Technologies

- **Framework:** Next.js 13 (Pages Router)
- **UI Library:** React 18.2
- **Styling:** SCSS Modules + Sass
- **Responsive:** react-responsive
- **PDF:** @react-pdf/renderer
- **i18n:** next-translate

### Files to Modify

**Phase 1:**

- `src/components/Form/Form.jsx` - Add section containers
- `src/components/Header/Header.jsx` - Update selectors
- `src/components/InvoiceTemplate/InvoiceTemplate.jsx` - Add template names
- `src/pages/templates.js` - Move Clear Data button
- `src/components/Preview/` - Fix template images

**Phase 2:**

- `src/components/Table/Table.jsx` - Redesign table
- `src/pages/templates.js` - Add responsive layout
- `src/components/Header/Header.jsx` - Add breadcrumbs
- New: `src/components/Toast/Toast.jsx` - Add toast notifications
- New: `src/components/MoreMenu/MoreMenu.jsx` - Settings menu

**Phase 3:**

- Multiple files - Accessibility audit & fixes
- New: `src/styles/design-system.scss` - Centralized styles
- New: `src/components/Settings/Settings.jsx` - Settings panel
- New: `src/components/EmptyState/EmptyState.jsx` - Onboarding

### Testing Strategy

**Unit Tests:**

- Form validation
- Currency/language selection
- Line items calculation

**Integration Tests:**

- Form submission → PDF generation
- Template selection → form population
- Data persistence → localStorage

**E2E Tests (Playwright/Cypress):**

- Complete user journey: Land → Select Template → Fill Form → Download PDF
- Mobile viewport testing
- All 6 languages

**Accessibility Tests:**

- axe DevTools scan
- Keyboard navigation
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)

**Performance Tests:**

- Bundle size
- PDF generation time
- Image loading
- Mobile network (Slow 4G throttle)

---

## Success Criteria & Acceptance

### Phase 1 Complete When:

- [ ] Template images load successfully
- [ ] Form sections visually grouped with distinct colors
- [ ] Selectors styled and functional
- [ ] "Clear Data" moved to safe menu with confirmation
- [ ] No console errors
- [ ] Tested on desktop and mobile

### Phase 2 Complete When:

- [ ] Table redesigned with better UX
- [ ] Mobile layout responsive (tested on 5 devices)
- [ ] Toast notifications working
- [ ] Template selection shows names and feedback
- [ ] All interactive elements are 44px+ on mobile
- [ ] Lighthouse Performance > 75

### Phase 3 Complete When:

- [ ] WCAG 2.1 AA accessibility audit passed
- [ ] Design system implemented
- [ ] Settings panel functional
- [ ] Empty state/onboarding added
- [ ] Keyboard navigation tested throughout
- [ ] All E2E tests passing

---

## Risk Mitigation

| Risk                            | Likelihood | Mitigation                                            |
| ------------------------------- | ---------- | ----------------------------------------------------- |
| Breaking existing functionality | Medium     | Comprehensive test coverage before deploy             |
| Mobile layout issues            | Medium     | Test on 5+ real devices                               |
| Performance regression          | Low        | Lighthouse monitoring, image optimization             |
| Accessibility issues            | Medium     | Professional a11y audit, automated testing            |
| Browser compatibility           | Low        | Cross-browser testing (Chrome, Firefox, Safari, Edge) |
| User confusion with new UI      | Low        | Gradual rollout, user feedback survey                 |

---

## Timeline & Resource Allocation

| Phase     | Duration      | Resource  | Effort       | Status       |
| --------- | ------------- | --------- | ------------ | ------------ |
| Phase 1   | 1-2 weeks     | 1 FE Dev  | 40-60h       | ✅ Completed |
| Phase 2   | 1-2 weeks     | 1 FE Dev  | 50-80h       | ✅ Completed |
| Phase 3   | 2 weeks       | 1 FE Dev  | 40-60h       | To Do        |
| **Total** | **4-6 weeks** | **1 Dev** | **130-200h** | In Progress  |

---

## Sign-Off & Approval

| Role          | Name         | Approval | Date        |
| ------------- | ------------ | -------- | ----------- |
| Product Owner | mlaplante    | ✅       | Feb 7, 2026 |
| Design Lead   | TBD          | ☐        | TBD         |
| Tech Lead     | Claude Haiku | ✅       | Feb 7, 2026 |

---

## Appendix: Design Specifications

### Color Palette

```
Primary Blue: #3b82f6
Primary Dark: #1e40af
Secondary Green: #22c55e
Secondary Dark: #15803d
Gray Light: #f3f4f6
Gray Dark: #111827
White: #ffffff
Error Red: #ef4444
Success Green: #10b981
```

### Typography

```
Headings: "Quicksand", sans-serif (bold)
Body: "Poppins", sans-serif (regular)
Monospace: "Inter", monospace (for amounts)
```

### Spacing Scale (8px grid)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Border Radius

```
Cards: 8px
Buttons: 6px
Inputs: 6px
Modals: 12px
```

---

**Document prepared by:** Claude Haiku 4.5
**Last updated:** February 7, 2026
**Next review:** After Phase 2 completion
