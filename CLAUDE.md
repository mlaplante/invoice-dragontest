# Invoice Dragon - Developer Guide

## Project Overview

Invoice Dragon is a lightweight, client-side Next.js 13 application for generating professional invoices and receipts. Users fill out a form, select a template, and download a PDF—all in the browser. No backend, no database, no authentication required.

**Website:** https://invoicedragon.com
**Repository:** https://github.com/mlaplante/invoice-dragontest
**License:** MIT

---

## Quick Start

### Prerequisites

- Node.js 18+ (see `.nvmrc` for exact version)
- npm (no Yarn/pnpm support currently)

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

---

## Tech Stack

| Layer                    | Technology                | Purpose                                                                    |
| ------------------------ | ------------------------- | -------------------------------------------------------------------------- |
| **Framework**            | Next.js 13 (Pages Router) | Web framework                                                              |
| **UI Library**           | React 18.2.0              | Component library                                                          |
| **PDF Generation**       | @react-pdf/renderer 3.1.9 | Client-side PDF rendering                                                  |
| **Internationalization** | next-translate 2.5.2      | Multi-language support (6 locales)                                         |
| **Styling**              | SCSS/SASS 1.60.0          | CSS preprocessing with modules                                             |
| **Responsive Design**    | react-responsive 9.0.2    | Media queries for mobile/tablet                                            |
| **Animation**            | typewriter-effect 2.19.0  | Text typing animation (landing page)                                       |
| **Linting**              | ESLint 9.39.2             | Code quality checks                                                        |
| **Language**             | JavaScript/JSX            | All source files are `.js` or `.jsx` (TypeScript installed but not active) |

---

## Directory Structure

```
src/
├── pages/                 # Next.js page routes
│   ├── index.js          # Landing page (hero + CTA)
│   ├── templates.js      # Main app (form + preview + PDF download)
│   ├── _app.js           # App wrapper (global fonts)
│   ├── _document.js      # HTML document setup
│   └── api/hello.js      # Placeholder API route (unused)
│
├── components/           # React components
│   ├── Form/            # Invoice form input (From, To, line items)
│   ├── Preview/         # PDF preview + 4 invoice template variants
│   │   ├── Templates/   # Template1.jsx - Template4.jsx
│   │   ├── PDFView.jsx  # PDF renderer component
│   │   └── Preview.jsx  # Preview container
│   ├── Table/           # Line items table (add/remove rows)
│   ├── InvoiceTemplate/ # Template selector (radio buttons + previews)
│   ├── Dropdown/        # Currency selector
│   ├── Header/          # Site header + navigation
│   ├── Home/            # Landing page hero content
│   └── Language/        # Language switcher
│
├── utils/               # Utility functions
│   └── storage.js       # localStorage helpers for company info persistence
│
├── data/                # Static data
│   └── currencies.json  # Currency codes and symbols
│
├── styles/              # Global and page-level styles
│   ├── index.css
│   └── *.module.scss    # CSS modules
│
├── sass/                # Additional SCSS
│   ├── base/            # Reset, typography
│   ├── utilities/       # Helper classes
│   └── variables.scss   # SCSS variables
│
└── assets/              # Static images
    ├── icons/           # SVG icons
    ├── images/          # Template preview images
    └── fonts/           # Custom fonts (Quicksand, Poppins, Inter, etc.)

locales/                 # Translation files (one per language)
├── en/common.json       # English translations
├── fr/common.json       # French
├── es/common.json       # Spanish
├── nl/common.json       # Dutch
├── de/common.json       # German
└── pt/common.json       # Portuguese

public/                  # Static assets served at root
└── assets/fonts/        # TTF font files (Quicksand, Poppins, etc.)
```

---

## Architecture

### Data Flow

1. **Landing Page** (`/index.js`)
   - Hero section with "Get Started" button
   - Links to `/templates`

2. **Main App** (`/templates.js`) - **Central hub**
   - Manages all application state (~15 pieces of state)
   - Renders Form, InvoiceTemplate selector, PDFPreview, Dropdown
   - Handles all event logic (form changes, template selection, currency, etc.)
   - Persists company info to localStorage

3. **Form Component** (`/components/Form/Form.jsx`)
   - Receives state + handlers from templates.js
   - Collects user input: company info, client info, invoice details, line items
   - Returns data via callback props

4. **Table Component** (`/components/Table/Table.jsx`)
   - Line items grid (description, qty, rate, amount)
   - Add/remove row buttons

5. **PDF Preview** (`/components/Preview/`)
   - Renders @react-pdf/renderer `<Document>` component
   - Displays chosen template (Template1-4)
   - Real-time preview as user types

6. **PDF Download**
   - Uses `<PDFDownloadLink>` from @react-pdf/renderer
   - Generates PDF client-side and prompts download

### State Management

**Approach:** Prop drilling from `templates.js` page component
**Reason:** Application is small enough that prop drilling is cleaner than Context API or Redux
**Future consideration:** If adding more nested components, consider extracting Form logic into separate component with local state

### Storage

**localStorage** (`src/utils/storage.js`)

- Persists user's company info (name, address, logo)
- Persists selected language preference
- Debounced 500ms to reduce write frequency
- Auto-loaded on page refresh

---

## Component Conventions

### File Naming

- **Components:** PascalCase with `.jsx` extension (e.g., `Form.jsx`, `Preview.jsx`)
- **CSS Modules:** `component-name.module.scss` (e.g., `form.module.scss`)
- **Page files:** lowercase with `.js` extension (e.g., `templates.js`, `index.js`)

### Component Structure

```jsx
import styles from './Component.module.scss'
import { useTranslation } from 'next-translate'

export default function Component({ prop1, prop2, onEvent }) {
  const { t } = useTranslation('common')

  return <div className={styles.container}>{/* JSX */}</div>
}
```

### Props Pattern

- Pass state + handlers from parent (templates.js)
- Use callback props for events: `onChange`, `onAdd`, `onRemove`, etc.
- Avoid direct localStorage access in components (use utils/storage.js)

---

## Internationalization (i18n)

### Supported Languages

- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)
- 🇳🇱 Dutch (nl)
- 🇩🇪 German (de)
- 🇵🇹 Portuguese (pt)

### Using Translations in Components

```jsx
import { useTranslation } from 'next-translate'

export default function Component() {
  const { t } = useTranslation('common')

  return <button>{t('common:download_pdf')}</button>
}
```

### Adding New Translation Keys

1. Add key to all 6 locale files in `/locales/`:

   ```json
   // locales/en/common.json
   { "my_new_key": "English text here" }

   // locales/fr/common.json
   { "my_new_key": "Texte français ici" }
   ```

2. Use in component:
   ```jsx
   const { t } = useTranslation('common')
   t('common:my_new_key')
   ```

### Configuration

See `/i18n.json` for:

- Available locales
- Default locale (English)
- Namespace configuration per page

---

## PDF Generation

### Using @react-pdf/renderer

The invoice templates are **not standard React components**—they use the `@react-pdf/renderer` API:

```jsx
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  container: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
})

export default function MyTemplate({ data }) {
  return (
    <Document>
      <Page style={styles.container}>
        <Text style={styles.title}>{data.companyName}</Text>
      </Page>
    </Document>
  )
}
```

### Key Differences from DOM React

- Use `<Page>` instead of `<div>` for pages
- Use `<View>` for containers (similar to `<div>`)
- Use `<Text>` for all text (no `<p>`, `<span>`, etc.)
- Use `StyleSheet.create()` for styling (inline styles like React Native)
- No CSS modules, no Flexbox utilities—basic layout only
- **Cannot use browser APIs** (window, document, fetch, etc.)

### Template Files

Located in `/src/components/Preview/Templates/`:

- `Template1.jsx` - Professional format
- `Template2.jsx` - Minimalist format
- `Template3.jsx` - Bold/colorful format
- `Template4.jsx` - Simple/clean format

**When modifying templates:**

- Only use `@react-pdf/renderer` components
- Reference `src/components/Preview/` files for current patterns
- Test PDF output using the preview feature in the app

---

## Code Patterns

### Form State Management

```jsx
// In templates.js
const [formData, setFormData] = useState({
  company: { name: '', address: '' },
  client: { name: '', email: '' },
  lineItems: [{ description: '', quantity: 1, rate: 0 }],
  currency: 'USD'
})

// Pass to Form component
<Form data={formData} onChange={setFormData} />
```

### Adding New Form Fields

1. Add field to state object in `templates.js`
2. Add input in `Form.jsx`
3. Update localStorage persistence if needed (`src/utils/storage.js`)
4. Add i18n label in `/locales/*/common.json`

### Adding New Templates

1. Create new file: `src/components/Preview/Templates/Template5.jsx`
2. Use @react-pdf/renderer components
3. Reference `formData` to populate content
4. Add radio button option in `InvoiceTemplate.jsx`
5. Add conditional render in `Preview.jsx`: `template === 5 ? <Template5 /> : ...`

### localStorage Persistence

```jsx
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/storage'

// Save with debouncing
useEffect(() => {
  const timer = setTimeout(() => {
    saveToLocalStorage('company', companyData)
  }, 500)

  return () => clearTimeout(timer)
}, [companyData])

// Load on mount
useEffect(() => {
  const saved = loadFromLocalStorage('company')
  if (saved) setCompanyData(saved)
}, [])
```

---

## Common Patterns to Follow

✅ **Do:**

- Use SCSS modules for component-scoped styles
- Extract repeated handlers into separate functions
- Use `useTranslation('common')` for all user-facing text
- Persist user preferences to localStorage
- Test components in PDF preview before shipping
- Keep components focused on single responsibility
- Use callback props for events (onChange, onClick, etc.)

❌ **Don't:**

- Add inline styles to components (use CSS modules)
- Use browser APIs (window, document) in PDF templates
- Mix CSS modules with global styles in same component
- Hard-code strings that users see (no translation keys)
- Directly manipulate DOM (stay within React lifecycle)
- Store sensitive data in localStorage
- Import from CSS files without `.module` suffix in components

---

## Things to Avoid

### ⚠️ Known Pitfalls

1. **PDF Components Can't Use Browser APIs**
   - ❌ Don't use `window`, `document`, `fetch` in Template components
   - ❌ Don't use event handlers like `onClick` in PDF content
   - ✅ Do pass data as props, use only @react-pdf/renderer components

2. **Styling PDF vs DOM**
   - ❌ Don't use CSS units (px, em, rem) in some contexts
   - ✅ Use consistent units (points/mm) throughout PDF
   - ❌ Don't expect CSS inheritance to work like DOM
   - ✅ Explicitly set all style properties needed

3. **i18n in Page Routes**
   - The Pages Router requires locale in URL path
   - ❌ Don't forget to include locale prefix in navigation
   - ✅ Use `next-translate` link helpers for navigation

4. **localStorage Naming**
   - Keys should be prefixed to avoid collisions
   - Use pattern: `invoiceDragon_keyName`

5. **State Lifting in Large Apps**
   - If templates.js file grows >400 lines, consider extracting state into custom hook or Context
   - Current size (~323 lines) is manageable

---

## Testing Strategy

Currently: **No tests configured**

When adding tests, focus on:

1. **Form component** - user input, validation
2. **Table component** - add/remove rows, calculations
3. **storage.js** - localStorage persistence, retrieval
4. **i18n** - translation key loading

Recommended setup:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Add test scripts:

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## Running Commands

| Command         | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start local dev server (http://localhost:3000) |
| `npm run build` | Create production build                        |
| `npm start`     | Run production build                           |
| `npm run lint`  | Check code with ESLint                         |
| `npm test`      | Run tests (not yet configured)                 |

---

## Performance Considerations

- **Code splitting:** Next.js handles automatically
- **Image optimization:** Using `next/image` not yet implemented (consider for template previews)
- **Bundle size:** Keep vendor dependencies minimal (@react-pdf/renderer is ~2MB)
- **localStorage:** Limited to 5-10MB—fine for company info, but don't store large blobs

---

## Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Docs: `docs/description`

### Commits

- Keep commits atomic (one logical change per commit)
- Use present tense: "Add feature" not "Added feature"
- Reference issues if applicable: "Fix #123: description"

### Pull Requests

- Describe what changed and why
- Reference any related issues
- Ensure linting passes: `npm run lint`
- When tests are added, ensure tests pass: `npm test`

---

## Useful Links

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **@react-pdf/renderer:** https://react-pdf.org
- **next-translate:** https://github.com/vinissimus/next-translate
- **SCSS Guide:** https://sass-lang.com/guide
- **ESLint Config:** `.eslintrc.json` (extends `next/core-web-vitals`)

---

## Questions?

This guide covers the most common tasks. For edge cases or questions:

1. Check existing component implementations for patterns
2. Inspect the templates.js file for state/event handling patterns
3. Reference the component library files in `/src/components/`
4. Review recent git commits for context on recent changes

---

**Last Updated:** 2026-02-06
**Maintained by:** Invoice Dragon Team
