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

- 🎯 **Simple Form Interface** - Collect company info, client details, line items in a clean UI
- 🎨 **4 Professional Templates** - Choose from multiple invoice designs to match your brand
- 📄 **Instant PDF Export** - Generate PDFs on-demand with zero backend calls
- 💾 **Auto-Save** - Your company info and logo are saved locally (never sent to servers)
- 🌍 **Multi-Language Support** - Available in 6 languages: English, French, Spanish, Dutch, German, Portuguese
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔒 **100% Client-Side** - All processing happens in your browser—complete privacy
- ⚡ **Lightning Fast** - No network requests, no database delays, instant results

---

## 🚀 Getting Started

### For Users

Visit **[laplantedevinvoices.netlify.app](https://laplantedevinvoices.netlify.app)** to start creating invoices immediately. No installation required.

### For Developers

#### Prerequisites

- **Node.js:** 18+ (see `.nvmrc` for exact version)
- **npm:** 8+ (or yarn/pnpm)
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
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint to check code quality
npm run format       # Format code with Prettier
npm run format:check # Check if code needs formatting
```

---

## 📁 Project Structure

```
invoice-dragontest/
├── src/
│   ├── pages/                    # Next.js page routes
│   │   ├── index.js             # Landing page
│   │   ├── templates.js         # Main invoice editor (central hub)
│   │   ├── _app.js              # App wrapper
│   │   └── _document.js         # HTML document setup
│   │
│   ├── components/              # React components
│   │   ├── Form/                # Invoice form (From, To, line items)
│   │   ├── Preview/             # PDF preview component
│   │   │   └── Templates/       # 4 invoice template variants
│   │   ├── Table/               # Line items table
│   │   ├── InvoiceTemplate/     # Template selector
│   │   ├── Dropdown/            # Currency selector
│   │   ├── Header/              # Navigation header
│   │   ├── Home/                # Landing page content
│   │   └── Language/            # Language switcher
│   │
│   ├── utils/                   # Utility functions
│   │   └── storage.js           # localStorage helpers
│   │
│   ├── styles/                  # Global & component styles (SCSS)
│   ├── sass/                    # Additional SCSS (variables, mixins)
│   └── assets/                  # Images, icons, fonts
│
├── locales/                     # i18n translation files (6 languages)
├── public/                      # Static assets
├── .github/
│   ├── workflows/test.yml       # GitHub Actions CI/CD
│   └── CODEOWNERS               # Code ownership config
├── .husky/                      # Git pre-commit hooks
├── CLAUDE.md                    # Developer guide for AI agents
├── .prettierrc.json             # Prettier formatting config
├── .eslintrc.json               # ESLint configuration
├── next.config.js               # Next.js configuration
├── i18n.json                    # i18n setup
└── package.json                 # Dependencies & scripts
```

---

## 🛠️ Tech Stack

| Purpose              | Technology          | Version |
| -------------------- | ------------------- | ------- |
| Framework            | Next.js             | 13.4.12 |
| UI Library           | React               | 18.2.0  |
| PDF Generation       | @react-pdf/renderer | 3.1.9   |
| Internationalization | next-translate      | 2.5.2   |
| Styling              | SCSS/SASS           | 1.60.0  |
| Responsive Design    | react-responsive    | 9.0.2   |
| Code Quality         | ESLint              | 9.39.2  |
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
├─→ [Preview] - Real-time PDF preview
│       ↓
│   [Template1-4] - @react-pdf/renderer
├─→ [Dropdown] - Currency selection
├─→ [InvoiceTemplate] - Template chooser
└─→ [localStorage] - Auto-persist company info
```

### Key Features

- **Client-Side Only** - No backend, no database, no API calls
- **Prop Drilling** - State managed in `templates.js` and passed down to components
- **localStorage Persistence** - Company info auto-saved with 500ms debounce
- **PDF Generation** - @react-pdf/renderer for client-side PDF creation
- **Multi-Language** - next-translate with 6 supported languages

For detailed architecture, component patterns, and development guidelines, see [**CLAUDE.md**](./CLAUDE.md).

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or template designs, we'd love your help.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them locally
4. **Commit with a clear message:**
   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** with a description of your changes

### Code Standards

- **Formatting:** Prettier is applied automatically on commit
- **Linting:** ESLint checks code quality (run `npm run lint`)
- **Language:** JavaScript/JSX (ES6+, not TypeScript)
- **Components:** Follow PascalCase naming, use SCSS modules for styles
- **i18n:** All user-facing text should use translation keys

See [**CLAUDE.md**](./CLAUDE.md) for detailed development guidelines.

### Running Tests (Future)

Once tests are added:

```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

---

## 🚢 Deployment

### Vercel (Recommended)

Invoice Dragon is optimized for [Vercel](https://vercel.com):

```bash
# Deploy automatically by pushing to GitHub
# Vercel will build and deploy on each push
```

### Docker

A Dockerfile can be added for self-hosted deployments. Contact the maintainer for details.

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

- **[GitHub Discussions](https://github.com/mlaplante/invoice-dragontest/discussions)** - Ask questions and share ideas

---

## 🐛 Known Issues & Limitations

- **No test coverage yet** - Tests are planned but not yet implemented
- **ESLint v9 compatibility** - Config format migration needed for full linting in pre-commit
- **TypeScript** - Types are available but source files are JavaScript (migration possible)
- **Templates are static** - Advanced customization (colors, logos) requires template editing

---

## 🔒 Privacy & Security

✅ **Your data stays on your device.** Invoice Dragon:

- Runs entirely in your browser
- Never sends data to external servers (except for analytics)
- Uses localStorage only for your convenience
- Is open-source so you can audit the code

⚠️ **Clearing browser data will delete saved company info.** Export or backup important information.

---

## 📝 License

Invoice Dragon is released under the **MIT License**. See [LICENSE](LICENSE) for details.

You are free to:

- Use commercially
- Modify the source code
- Distribute copies
- Use privately

Just include the original copyright notice.

---

## 📞 Support

### For Users

- Visit [laplantedevinvoices.netlify.app](https://laplantedevinvoices.netlify.app)
- Check the in-app help or contact page

### For Developers

- Review [CLAUDE.md](./CLAUDE.md) for development questions
- Open an issue on [GitHub Issues](https://github.com/mlaplante/invoice-dragontest/issues)
- Contribute via Pull Requests

---

## 🎯 Roadmap

- [ ] Jest + React Testing Library integration
- [ ] TypeScript migration
- [ ] ESLint v9 config format update
- [ ] Additional invoice templates
- [ ] Custom branding/theme options
- [ ] Invoice history / saved drafts
- [ ] Multi-page invoices
- [ ] Receipt-specific templates
- [ ] Batch invoice generation
- [ ] Email integration

---

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev)
- PDF generation by [@react-pdf/renderer](https://react-pdf.org/)
- Internationalization by [next-translate](https://github.com/vinissimus/next-translate)
- Deployed on [Vercel](https://vercel.com)

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
