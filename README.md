# Invoice Dragon 🐉

> Generate professional invoices and receipts in seconds. No backend required—all processing happens in your browser.

[![Build Status](https://github.com/mlaplante/invoice-dragontest/actions/workflows/test.yml/badge.svg)](https://github.com/mlaplante/invoice-dragontest/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live App:** [laplantedevinvoices.netlify.app](https://laplantedevinvoices.netlify.app)

---

## About

Invoice Dragon is a lightweight, client-side invoicing application built with Next.js and React. Fill out a simple form, choose from 4 professional templates, and download your invoice as a PDF—all without creating an account or sending data to any server.

### Why I Built This

Over the years running multiple businesses, I found the invoice creation process tedious. Most solutions force you to use inflexible templates or require complex software. Invoice Dragon was created to solve a simple problem: **make professional invoices quickly, with full control, and zero friction.**

The result: fill a form, select a template, download PDF. Done.

---

## ✨ Features

- 🎯 **Simple Form Interface** - Grouped sections (From, Bill To, Details) with a clean, color-coded UI
- 🎨 **4 Professional Templates** - Descriptive template selection with instant visual feedback
- 📄 **Instant PDF Export** - Generate PDFs on-demand with real-time preview functionality
- 💾 **Auto-Save & Onboarding** - Local data persistence with a "Load Example Data" feature for quick starts
- 🌍 **Multi-Language Support** - Enhanced Language Selector supporting 6 languages with icons
- 📱 **Fully Responsive** - Mobile-first design with sticky action footers for seamless editing on any device
- 🛡️ **Reliable & Validated** - Comprehensive form validation and error handling for a smooth experience
- 📂 **Invoice History** - Save, view, and edit past invoices directly in your browser
- 👥 **Client Management** - Save client details for quick re-use on future invoices
- 🌓 **Dark Mode** - Full support for light and dark themes with persistent user preference
- 🎨 **Custom Branding** - Personalize invoices with your own brand colors and fonts
- 📦 **Data Backup** - Export and import your entire application state via JSON
- 🔒 **100% Client-Side** - No backend required; all data stays private in your browser
- ⚡ **Lightning Fast** - Built on Next.js 15 and React 19 for optimal performance

---

## 🧪 Testing & Quality

Invoice Dragon maintains a growing suite of tests to ensure financial accuracy and application reliability.

### Test Coverage

Current coverage statistics (as of Feb 7, 2026):

| Category   | Coverage |
| ---------- | -------- |
| Statements | 21.74%   |
| Branches   | 21.33%   |
| Functions  | 17.75%   |
| Lines      | 21.67%   |

_Coverage focus: Core financial logic, data persistence, and validation utilities._

---

## 🛤️ Development Roadmap (Phases 1-6)

We have successfully completed our comprehensive improvement roadmap:

### ✅ Phase 1: Emergency Fixes

- Resolved critical production bugs including PDF rendering and logo issues.
- Fixed header logo visibility and mobile responsiveness.

### ✅ Phase 2: Testing & Reliability

- Established robust testing infrastructure with Jest and React Testing Library.
- Implemented error boundaries and comprehensive form validation.

### ✅ Phase 3: UX Polish

- Redesigned landing page and added a full Settings panel.
- Implemented power-user keyboard shortcuts.

### ✅ Phase 4: Accessibility & Performance

- Achieved WCAG 2.1 AA compliance standards.
- Optimized performance and enhanced SEO with structured data.

### ✅ Phase 5: Invoice Management

- Implemented persistent Invoice History and automatic Draft saving.
- Added Client Management system for rapid invoice creation.
- Integrated automatic sequential invoice numbering.

### ✅ Phase 6: Advanced Features

- Implemented full Dark Mode support with theme switching.
- Added Custom Branding (colors/fonts) for PDF generation.
- Added comprehensive Data Export & Import (JSON backup).
- Implemented Receipt Mode with dynamic "PAID" stamps.

---

## 🚀 Getting Started

### For Users

Visit **[laplantedevinvoices.netlify.app](https://laplantedevinvoices.netlify.app)** to start creating invoices immediately. No installation required.

### For Developers

#### Prerequisites

- **Node.js:** 18+ (tested on v25.6.0)
- **npm:** 10+
- **Git:** For cloning the repository

#### Installation

```bash
# Clone the repository
git clone https://github.com/mlaplante/invoice-dragontest.git
cd invoice-dragontest

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

#### Available Scripts

```bash
npm run dev          # Start development server (with hot reload)
npm run build        # Build for production (Next.js 15)
npm start            # Start production server
npm run lint         # Run ESLint v9 (Flat Config) to check code quality
npm run format       # Format code with Prettier
```

---

## 📁 Project Structure

```
invoice-dragontest/
├── src/
│   ├── pages/                    # Next.js page routes
│   │   ├── templates.js         # Main invoice editor (dynamic client-only rendering)
│   │   └── ...
│   │
│   ├── components/              # React 19 components
│   │   ├── Form/                # Enhanced Invoice form with section grouping
│   │   ├── Preview/             # Client-guarded PDF preview
│   │   ├── Table/               # Redesigned Line items table with textarea support
│   │   ├── Dropdown/            # Styled Currency selector
│   │   ├── Toast/               # Visual feedback system (save/loading notifications)
│   │   ├── MoreMenu/            # Overflow menu for safe data management
│   │   ├── Language/            # Enhanced Language selector
│   │   └── ...
│   │
│   ├── styles/                  # Design System (SCSS variables & global components)
│   ├── sass/                    # Typography and layout base
│   └── assets/                  # Reliable static assets (public directory mirrored)
│
├── locales/                     # Localized translation files
├── eslint.config.mjs            # Modern ESLint 9 Flat Config
└── ...
```

---

## 🛠️ Tech Stack

| Purpose              | Technology          | Version |
| -------------------- | ------------------- | ------- |
| Framework            | Next.js             | 15.5.12 |
| UI Library           | React               | 19.0.0  |
| PDF Generation       | @react-pdf/renderer | 4.3.2   |
| Internationalization | next-translate      | 2.6.2   |
| Styling              | SCSS/SASS           | 1.97.3  |
| Responsive Design    | react-responsive    | 10.0.1  |
| Code Quality         | ESLint              | 9.19.0  |
| Code Formatting      | Prettier            | 3.8.1   |
| Language             | JavaScript/JSX      | -       |

---

## 🏗️ Architecture

### Data Flow

```
User Input (Form)
    ↓
[templates.js] - Central State Management
    ↓
├─→ [Preview] - Client-side dynamic preview
│       ↓
│   [Template1-4] - Modernized PDF designs
├─→ [Selectors] - Improved UX for Language/Currency
├─→ [MoreMenu] - Onboarding & Data Management
└─→ [Toast] - Real-time visual feedback
```

### Key Features

- **Modern Stack** - Fully upgraded to React 19 and Next.js 15 for stability and speed.
- **Robust Linting** - Migrated to ESLint 9 Flat Config system for improved code standards.
- **Client-Side Security** - Zero known vulnerabilities; all browser-only APIs are guarded.
- **Design System** - Standardized typography (Quicksand/Poppins) and 8px grid spacing.

For detailed architecture, component patterns, and development guidelines, see [**CLAUDE.md**](./CLAUDE.md).

---

## 🤝 Contributing

Contributions are welcome! We recently completed a major UI/UX overhaul and dependency audit.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them locally (`npm run build`)
4. **Commit with a clear message:**
   ```bash
   git commit -m "feat: your feature description"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** with a description of your changes

---

## 🚢 Deployment

### Netlify (Recommended)

Invoice Dragon is optimized for [Netlify](https://www.netlify.com/):

```bash
# Deploy automatically by pushing to GitHub
# Netlify will build and deploy on each push
```

### Environment Variables

No environment variables required. Invoice Dragon works out-of-the-box.

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive developer guide including:
  - Project architecture and data flow
  - Component patterns and conventions
  - i18n workflow for translations
  - PDF generation with @react-pdf/renderer
  - Common pitfalls and best practices
  - Git workflow guidelines

---

## 🐛 Known Issues & Limitations

- **Browser Storage** - Clearing browser data will delete saved company info.
- **PDF Viewer** - Some mobile browsers may require "Download" instead of "Preview".

---

## 🔒 Privacy & Security

✅ **Your data stays on your device.** This project has undergone a full dependency audit:

- All critical security vulnerabilities resolved.
- Updated to the latest patched versions of Next.js and React.
- 100% browser-based processing—no data collection.

⚠️ **Clearing browser data will delete saved company info.** Export or backup important information.

---

## 🎯 Roadmap

- [x] Phase 1: Emergency Fixes (Production bugs, PDF rendering)
- [x] Phase 2: Testing & Reliability (Jest, Validation, Error Boundaries)
- [x] Phase 3: UX Polish (Settings, Landing Page, Shortcuts)
- [x] Phase 4: Accessibility & Performance (WCAG, SEO, Legal Pages)
- [x] Phase 5: Invoice Management (History, Drafts, Clients)
- [x] Phase 6: Advanced Features (Dark Mode, Custom Branding, Backup)
- [ ] TypeScript Full Migration

---

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev)
- PDF generation by [@react-pdf/renderer](https://react-pdf.org/)
- Deployed on [Netlify](https://www.netlify.com/)

---

## 📈 Stats

- ⚡ Lightning fast (~2-3 seconds to generate PDF)
- 📦 ~150KB gzipped (optimized bundle)
- 🌍 6 languages supported
- 🎨 4 professional templates
- 🔒 100% client-side processing

---

**Made with ❤️ by [@mlaplante](https://github.com/mlaplante)**

Thank you for using Invoice Dragon! Your feedback and contributions make this project better. Happy invoicing! 🐉
