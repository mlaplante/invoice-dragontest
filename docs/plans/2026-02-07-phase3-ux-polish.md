# Phase 3: UX Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Smooth out the user experience with better feedback, navigation, interaction patterns, and first-time user experience across 5 feature areas.

**Architecture:**

- 3.1 Download Flow: Modify PDF button logic to allow direct download or add clear messaging
- 3.2 Settings Panel: New modal component with localStorage persistence for preferences
- 3.3 Keyboard Shortcuts: Add global keydown listener in templates.js with help tooltip
- 3.4 Landing Page: Expand index.js with features section, how-it-works, and footer
- 3.5 Empty States: Add placeholder text to form inputs and dismissible tip banner

**Tech Stack:** React 18, Next.js 15, SCSS modules, localStorage API, next-translate

**Execution Model:** Option A (one commit per feature) with sequential implementation

---

## Feature 3.1: Improve Download PDF Flow

**Goal:** Allow users to download PDF without requiring preview first, or provide clear explanation if preview is mandatory.

**Approach:** Allow direct download while PDF generates in background. Show loading state on button.

**Files:**

- Modify: `src/pages/templates.js` (handleToggle, PDF download logic)
- Modify: `src/components/Form/Form.jsx` (button state)
- Modify: `src/styles/Home.module.scss` (button loading state styling)

### Task 1.1: Write failing test for direct download

**File:** `src/utils/__tests__/downloadFlow.test.js` (NEW)

**Step 1: Write the failing test**

```javascript
import { validateBeforeDownload } from '@/utils/validation'

describe('Download PDF Flow', () => {
  test('allows download when businessName and clientName are present', () => {
    const formData = {
      businessName: 'Dragon Corp',
      clientName: 'Client Inc.',
    }
    const rows = [{ id: 0, description: 'Service', rate: 100, quantity: 1, amount: '100.00' }]

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(true)
  })

  test('prevents download when businessName is missing', () => {
    const formData = { businessName: '', clientName: 'Client Inc.' }
    const rows = [{ id: 0, description: 'Service', rate: 100, quantity: 1, amount: '100.00' }]

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('businessName is required')
  })

  test('prevents download when no line items present', () => {
    const formData = { businessName: 'Dragon Corp', clientName: 'Client Inc.' }
    const rows = []

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one line item is required')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- src/utils/__tests__/downloadFlow.test.js
```

Expected output: `validateBeforeDownload is not defined`

### Task 1.2: Implement validateBeforeDownload function

**File:** `src/utils/validation.js` (MODIFY)

Add this export to the existing validation.js file:

```javascript
/**
 * Validates download requirements (same as preview)
 * @param {Object} formData - Form data object
 * @param {Array} rows - Array of line item rows
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export function validateBeforeDownload(formData, rows) {
  const errors = []
  const requiredFields = ['businessName', 'clientName']

  const missingFields = validateRequiredFields(formData, requiredFields)
  if (missingFields.length > 0) {
    missingFields.forEach((field) => {
      errors.push(`${field} is required`)
    })
  }

  const lineItemsValidation = validateLineItems(rows)
  if (!lineItemsValidation.valid) {
    errors.push(...lineItemsValidation.errors)
  }

  return { valid: errors.length === 0, errors }
}
```

**Step 3: Run tests to verify they pass**

```bash
npm test -- src/utils/__tests__/downloadFlow.test.js
```

Expected: All 3 tests pass

### Task 1.3: Update templates.js to support direct download

**File:** `src/pages/templates.js` (MODIFY)

**Current code (lines 381-391):**

```javascript
<PDFDownloadLink
  document={pdf}
  fileName={`${formData.clientName}_${formData.formName}.pdf`}
  style={{ width: '100%', flex: isMobile ? 1 : 'unset' }}
>
  {({ blob, url, loading, error }) => (
    <button className={styles.action__btn} disabled={!showPreview}>
      {t('download_pdf')}
    </button>
  )}
</PDFDownloadLink>
```

Replace with:

```javascript
const handleDownloadClick = () => {
  const downloadValidation = validateBeforeDownload(formData, rows)

  if (!downloadValidation.valid) {
    const errors = downloadValidation.errors
    showToast(errors.join(' • '), 'error')
    return
  }

  // Validation passed, allow download to proceed
  // PDFDownloadLink will handle the rest
}

// In JSX:
;<PDFDownloadLink
  document={pdf}
  fileName={`${formData.clientName}_${formData.formName}.pdf`}
  style={{ width: '100%', flex: isMobile ? 1 : 'unset' }}
>
  {({ blob, url, loading, error }) => (
    <button
      className={`${styles.action__btn} ${loading ? styles.loading : ''}`}
      onClick={handleDownloadClick}
      disabled={loading}
    >
      {loading ? t('downloading') || 'Downloading...' : t('download_pdf')}
    </button>
  )}
</PDFDownloadLink>
```

**Step 4: Add import**

At the top of templates.js, update the validation import:

```javascript
import {
  validateRequiredFields,
  validateLineItems,
  validateBeforeDownload,
} from '../utils/validation'
```

**Step 5: Add translation keys**

Update `locales/en/common.json`:

```json
{
  "downloading": "Downloading..."
}
```

Do the same for all 6 locale files (fr, es, nl, de, pt).

**Step 6: Add CSS for loading state**

**File:** `src/styles/Home.module.scss` (MODIFY)

Add this to the `.action__btn` class or create new:

```scss
.action__btn {
  // ... existing styles ...

  &.loading {
    opacity: 0.7;
    cursor: wait;
    pointer-events: none;
  }
}
```

### Task 1.4: Run tests and verify functionality

**Step 1: Run all tests**

```bash
npm test
```

Expected: All 40 tests pass (37 existing + 3 new download tests)

**Step 2: Run the app locally**

```bash
npm run dev
```

Navigate to `/templates`, fill in form, verify:

- Download button is enabled without preview
- Clicking download with incomplete form shows error toast
- Clicking download with complete form triggers PDF download
- Button shows "Downloading..." state while generating

### Task 1.5: Commit

```bash
git add src/utils/validation.js src/utils/__tests__/downloadFlow.test.js src/pages/templates.js src/styles/Home.module.scss locales/*/common.json
git commit -m "feat: allow direct PDF download without preview requirement

- Add validateBeforeDownload() function to validation utilities
- Update templates.js to enable download button without preview
- Add loading state to download button during PDF generation
- Show validation errors in toast if form incomplete
- Add 'downloading' translation keys to all 6 locales
- All 40 tests passing"
```

---

## Feature 3.2: Implement Settings Panel

**Goal:** Create a settings panel accessible from MoreMenu with preferences for currency, language, auto-numbering, default notes, and data export/import.

**Approach:** New Modal component with tabs for different settings categories. Persist to localStorage. Use existing currency and language infrastructure.

**Files:**

- Create: `src/components/Settings/Settings.jsx`
- Create: `src/components/Settings/settings.module.scss`
- Create: `src/utils/__tests__/settingsStorage.test.js`
- Modify: `src/pages/templates.js` (add settings state and modal)
- Modify: `src/components/MoreMenu.jsx` (add settings button)

### Task 2.1: Write failing test for settings storage

**File:** `src/utils/__tests__/settingsStorage.test.js` (NEW)

```javascript
import { saveSettings, loadSettings, getDefaultSettings } from '@/utils/settingsStorage'

describe('Settings Storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns default settings when none saved', () => {
    const defaults = getDefaultSettings()
    expect(defaults).toHaveProperty('currency', 'USD')
    expect(defaults).toHaveProperty('language', 'en')
    expect(defaults).toHaveProperty('autoIncrement', true)
    expect(defaults).toHaveProperty('defaultNotes', '')
  })

  test('saves settings to localStorage', () => {
    const settings = {
      currency: 'EUR',
      language: 'fr',
      autoIncrement: false,
      defaultNotes: 'Payment due in 30 days',
    }

    saveSettings(settings)
    const loaded = loadSettings()

    expect(loaded.currency).toBe('EUR')
    expect(loaded.defaultNotes).toBe('Payment due in 30 days')
  })

  test('loads previously saved settings', () => {
    localStorage.setItem(
      'invoiceDragon_settings',
      JSON.stringify({
        currency: 'GBP',
        language: 'en',
      })
    )

    const loaded = loadSettings()
    expect(loaded.currency).toBe('GBP')
  })

  test('handles corrupted settings gracefully', () => {
    localStorage.setItem('invoiceDragon_settings', 'invalid json {')

    const loaded = loadSettings()
    expect(loaded.currency).toBe('USD') // Falls back to defaults
  })
})
```

### Task 2.2: Create settingsStorage utility

**File:** `src/utils/settingsStorage.js` (NEW)

```javascript
const SETTINGS_KEY = 'invoiceDragon_settings'

export function getDefaultSettings() {
  return {
    currency: 'USD',
    language: 'en',
    autoIncrement: true,
    autoIncrementFormat: 'INV-YYYY-###', // INV-2026-001
    defaultNotes: '',
    theme: 'light', // For future dark mode support
  }
}

export function saveSettings(settings) {
  try {
    const merged = { ...getDefaultSettings(), ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (!saved) return getDefaultSettings()

    const parsed = JSON.parse(saved)
    // Merge with defaults to ensure all keys present (in case of app updates)
    return { ...getDefaultSettings(), ...parsed }
  } catch (error) {
    console.error('Error loading settings:', error)
    return getDefaultSettings()
  }
}

export function clearSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY)
    return true
  } catch (error) {
    console.error('Error clearing settings:', error)
    return false
  }
}
```

### Task 2.3: Run settings storage tests

```bash
npm test -- src/utils/__tests__/settingsStorage.test.js
```

Expected: 4 tests pass

### Task 2.4: Create Settings component

**File:** `src/components/Settings/Settings.jsx` (NEW)

```javascript
import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { saveSettings, loadSettings, clearSettings } from '@/utils/settingsStorage'
import { saveCompanyInfo, loadCompanyInfo, clearCompanyInfo, clearLogo } from '@/utils/storage'
import styles from './settings.module.scss'

export default function Settings({ isOpen, onClose, onSettingsChange }) {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})
  const [exportData, setExportData] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const loaded = loadSettings()
      setSettings(loaded)
    }
  }, [isOpen])

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    saveSettings(updated)
    onSettingsChange?.(updated)
  }

  const handleExportData = () => {
    const allData = {
      settings,
      companyInfo: loadCompanyInfo(),
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
    }

    const json = JSON.stringify(allData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-dragon-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClearAllData = () => {
    if (window.confirm(t('clear_all_confirm') || 'This will delete all your data. Are you sure?')) {
      clearSettings()
      clearCompanyInfo()
      clearLogo()
      setSettings({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('settings') || 'Settings'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            {t('general') || 'General'}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'data' ? styles.active : ''}`}
            onClick={() => setActiveTab('data')}
          >
            {t('data') || 'Data'}
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'general' && (
            <div className={styles.tabPane}>
              <div className={styles.setting}>
                <label>{t('auto_increment_invoices') || 'Auto-increment invoice numbers'}</label>
                <input
                  type="checkbox"
                  checked={settings.autoIncrement}
                  onChange={(e) => handleSettingChange('autoIncrement', e.target.checked)}
                />
              </div>

              <div className={styles.setting}>
                <label htmlFor="defaultNotes">
                  {t('default_notes') || 'Default payment terms/notes'}
                </label>
                <textarea
                  id="defaultNotes"
                  value={settings.defaultNotes || ''}
                  onChange={(e) => handleSettingChange('defaultNotes', e.target.value)}
                  placeholder="e.g., Payment due within 30 days"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className={styles.tabPane}>
              <div className={styles.dataActions}>
                <button className={styles.btnPrimary} onClick={handleExportData}>
                  {t('export_data') || 'Export Data (JSON)'}
                </button>
                <p className={styles.hint}>
                  {t('export_hint') || 'Download a backup of your settings and company info'}
                </p>
              </div>

              <div className={styles.divider} />

              <div className={styles.dataActions}>
                <button className={styles.btnDanger} onClick={handleClearAllData}>
                  {t('clear_all_data') || 'Clear All Data'}
                </button>
                <p className={styles.hint}>
                  {t('clear_all_hint') || 'Permanently delete all saved data (cannot be undone)'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Task 2.5: Create Settings styles

**File:** `src/components/Settings/settings.module.scss` (NEW)

```scss
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 20px;
  }
}

.closeBtn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #000;
  }
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
}

.tab {
  background: none;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  color: #666;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #000;
  }

  &.active {
    color: #007bff;
    border-bottom-color: #007bff;
  }
}

.content {
  padding: 20px;
}

.tabPane {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.setting {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  input[type='checkbox'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }
}

.dataActions {
  margin-bottom: 20px;
}

.btnPrimary,
.btnDanger {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btnPrimary {
  background: #007bff;
  color: white;

  &:hover {
    background: #0056b3;
  }
}

.btnDanger {
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
  }
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 20px 0;
}
```

### Task 2.6: Integrate Settings into MoreMenu

**File:** `src/components/MoreMenu.jsx` (MODIFY)

Add Settings button to the menu. Find the MoreMenu component and add:

```javascript
// At top of component:
import Settings from './Settings/Settings'

// In state:
const [showSettings, setShowSettings] = useState(false)

// Add to menu items:
const menuItems = [
  // ... existing items ...
  {
    label: t('settings') || 'Settings',
    onClick: () => setShowSettings(true),
  },
]

// Add after menu JSX:
<Settings
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  onSettingsChange={onSettingsChange}
/>
```

### Task 2.7: Add Settings state to templates.js

**File:** `src/pages/templates.js` (MODIFY)

Add at top of Templates component:

```javascript
const handleSettingsChange = useCallback(
  (newSettings) => {
    // Update currency if changed in settings
    if (newSettings.currency && newSettings.currency !== currencyCode) {
      // Optionally handle currency change
    }
  },
  [currencyCode]
)
```

### Task 2.8: Add translation keys for Settings

Update all 6 locale files (`locales/*/common.json`):

```json
{
  "settings": "Settings",
  "general": "General",
  "data": "Data",
  "auto_increment_invoices": "Auto-increment invoice numbers",
  "default_notes": "Default payment terms/notes",
  "default_notes_placeholder": "e.g., Payment due within 30 days",
  "export_data": "Export Data (JSON)",
  "export_hint": "Download a backup of your settings and company info",
  "clear_all_data": "Clear All Data",
  "clear_all_hint": "Permanently delete all saved data (cannot be undone)",
  "clear_all_confirm": "This will delete all your data. Are you sure?"
}
```

### Task 2.9: Run tests and verify

```bash
npm test -- src/utils/__tests__/settingsStorage.test.js
```

Expected: 4 tests pass

```bash
npm run dev
```

Navigate to `/templates`, click MoreMenu → Settings, verify:

- Settings panel opens
- Tabs switch between General and Data
- Settings persist across page refresh
- Export Data downloads JSON file
- Close button works

### Task 2.10: Commit

```bash
git add src/components/Settings/ src/utils/settingsStorage.js src/utils/__tests__/settingsStorage.test.js src/components/MoreMenu.jsx src/pages/templates.js locales/*/common.json
git commit -m "feat: implement settings panel with preferences and data export

- Create Settings component with two tabs: General and Data
- Add settingsStorage utility for managing user preferences
- Support auto-increment toggle and default notes
- Add data export functionality (JSON backup)
- Add clear all data with confirmation
- Integrate Settings into MoreMenu
- Add 44 tests total (4 new settings tests)
- Add translation keys for all 6 locales"
```

---

## Feature 3.3: Keyboard Shortcuts

**Goal:** Add common keyboard shortcuts (Cmd/Ctrl+P for preview, Cmd/Ctrl+D for download, Escape to close, Cmd/Ctrl+S for save).

**Approach:** Global keydown listener in templates.js using useEffect.

**Files:**

- Modify: `src/pages/templates.js` (add keyboard listener)
- Modify: `src/components/Header/Header.jsx` (show shortcuts in help)
- Create: `src/utils/__tests__/keyboardShortcuts.test.js`

### Task 3.1: Write failing test for keyboard shortcuts

**File:** `src/utils/__tests__/keyboardShortcuts.test.js` (NEW)

```javascript
import { parseKeyboardEvent } from '@/utils/keyboardShortcuts'

describe('Keyboard Shortcuts', () => {
  test('recognizes Cmd+P as preview shortcut on Mac', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'p',
      metaKey: true,
      ctrlKey: false,
    })

    const result = parseKeyboardEvent(event)
    expect(result).toBe('preview')
  })

  test('recognizes Ctrl+P as preview shortcut on Windows', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'p',
      metaKey: false,
      ctrlKey: true,
    })

    const result = parseKeyboardEvent(event)
    expect(result).toBe('preview')
  })

  test('recognizes Cmd/Ctrl+D as download', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'd',
      metaKey: true,
    })

    const result = parseKeyboardEvent(event)
    expect(result).toBe('download')
  })

  test('recognizes Escape as close', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
    })

    const result = parseKeyboardEvent(event)
    expect(result).toBe('close')
  })

  test('ignores shortcuts when modifier keys are different', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'p',
      metaKey: false,
      ctrlKey: false,
    })

    const result = parseKeyboardEvent(event)
    expect(result).toBe(null)
  })

  test('ignores shortcuts when typing in input field', () => {
    const inputElement = document.createElement('input')
    const event = new KeyboardEvent('keydown', {
      key: 'p',
      metaKey: true,
      target: inputElement,
    })
    Object.defineProperty(event, 'target', { value: inputElement })

    const result = parseKeyboardEvent(event, { ignoreInputFocus: true })
    expect(result).toBe(null)
  })
})
```

### Task 3.2: Create keyboard shortcuts utility

**File:** `src/utils/keyboardShortcuts.js` (NEW)

```javascript
/**
 * Parse keyboard event and return shortcut name or null
 * @param {KeyboardEvent} event
 * @param {Object} options - { ignoreInputFocus: boolean }
 * @returns {string|null} - 'preview', 'download', 'close', 'save', or null
 */
export function parseKeyboardEvent(event, options = {}) {
  const { ignoreInputFocus = true } = options

  // If ignoreInputFocus is true, skip shortcuts when typing in input/textarea
  if (ignoreInputFocus) {
    const target = event.target
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return null
    }
  }

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const modifierPressed = isMac ? event.metaKey : event.ctrlKey

  const key = event.key.toLowerCase()

  // Cmd/Ctrl + P = Preview
  if (key === 'p' && modifierPressed) {
    return 'preview'
  }

  // Cmd/Ctrl + D = Download
  if (key === 'd' && modifierPressed) {
    return 'download'
  }

  // Cmd/Ctrl + S = Save
  if (key === 's' && modifierPressed) {
    return 'save'
  }

  // Escape = Close
  if (key === 'escape') {
    return 'close'
  }

  return null
}

/**
 * Get readable shortcut text for display
 * @returns {Object} - Map of shortcut name to readable text
 */
export function getShortcutsHelp() {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const modifier = isMac ? '⌘' : 'Ctrl'

  return {
    preview: `${modifier} + P - Preview invoice`,
    download: `${modifier} + D - Download PDF`,
    save: `${modifier} + S - Save (coming soon)`,
    close: `Esc - Close preview`,
  }
}
```

### Task 3.3: Run keyboard shortcuts tests

```bash
npm test -- src/utils/__tests__/keyboardShortcuts.test.js
```

Expected: 6 tests pass

### Task 3.4: Integrate keyboard shortcuts into templates.js

**File:** `src/pages/templates.js` (MODIFY)

Add import:

```javascript
import { parseKeyboardEvent } from '@/utils/keyboardShortcuts'
```

Add this useEffect hook after the existing useEffects (around line 290):

```javascript
// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (event) => {
    const shortcut = parseKeyboardEvent(event)

    if (shortcut === 'preview') {
      event.preventDefault()
      handleToggle()
    } else if (shortcut === 'download') {
      event.preventDefault()
      // Trigger download - the PDFDownloadLink will handle it
      const downloadBtn = document.querySelector('[data-testid="download-pdf-btn"]')
      if (downloadBtn) {
        downloadBtn.click()
      }
    } else if (shortcut === 'close') {
      event.preventDefault()
      if (showPreview) {
        handleToggle()
      }
      // Also close any open modals
      setShowClearDialog(false)
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [showPreview, handleToggle])
```

Add data-testid to PDFDownloadLink:

```javascript
<PDFDownloadLink
  document={pdf}
  fileName={`${formData.clientName}_${formData.formName}.pdf`}
  style={{ width: '100%', flex: isMobile ? 1 : 'unset' }}
  data-testid="download-pdf-btn"
>
```

### Task 3.5: Show keyboard shortcuts in Help

**File:** `src/components/Header/Header.jsx` (MODIFY)

Update the Help button to show shortcuts. Add a tooltip or modal:

```javascript
import { getShortcutsHelp } from '@/utils/keyboardShortcuts'

// Add state
const [showShortcuts, setShowShortcuts] = useState(false)

// Update Help button
onClick={() => setShowShortcuts(true)}

// Add modal to show shortcuts:
{showShortcuts && (
  <div className={styles.shortcutsModal}>
    <button className={styles.closeBtn} onClick={() => setShowShortcuts(false)}>×</button>
    <h3>{t('keyboard_shortcuts') || 'Keyboard Shortcuts'}</h3>
    {Object.entries(getShortcutsHelp()).map(([key, text]) => (
      <div key={key} className={styles.shortcutItem}>
        {text}
      </div>
    ))}
  </div>
)}
```

### Task 3.6: Add translation keys

Update all 6 locale files:

```json
{
  "keyboard_shortcuts": "Keyboard Shortcuts"
}
```

### Task 3.7: Run tests and verify

```bash
npm test
```

Expected: 50 tests pass (44 + 6 new keyboard tests)

```bash
npm run dev
```

Verify:

- Cmd/Ctrl+P toggles preview
- Cmd/Ctrl+D triggers download
- Escape closes preview
- Shortcuts don't trigger when typing in form fields
- Help button shows shortcuts

### Task 3.8: Commit

```bash
git add src/utils/keyboardShortcuts.js src/utils/__tests__/keyboardShortcuts.test.js src/pages/templates.js src/components/Header/Header.jsx locales/*/common.json
git commit -m "feat: add keyboard shortcuts for power users

- Add Cmd/Ctrl+P to preview invoice
- Add Cmd/Ctrl+D to download PDF
- Add Escape to close preview/modals
- Add keyboard shortcuts help in Help button
- Shortcuts respect platform (Mac uses ⌘, Windows uses Ctrl)
- Shortcuts disabled when typing in form fields
- Add 50 tests total (6 new keyboard tests)
- Add translation key for shortcuts help"
```

---

## Feature 3.4: Improve Landing Page

**Goal:** Expand landing page with feature highlights, how-it-works section, and footer for better conversion.

**Approach:** Add new sections below hero in index.js with cards and step-by-step flow.

**Files:**

- Modify: `src/pages/index.js`
- Create: `src/components/Home/Features.jsx`
- Create: `src/components/Home/HowItWorks.jsx`
- Create: `src/components/Home/Footer.jsx`
- Create: `src/styles/components/features.module.scss`
- Create: `src/styles/components/howItWorks.module.scss`
- Create: `src/styles/components/footer.module.scss`

### Task 4.1: Create Features component

**File:** `src/components/Home/Features.jsx` (NEW)

```javascript
import useTranslation from 'next-translate/useTranslation'
import styles from '@/styles/components/features.module.scss'

export default function Features() {
  const { t } = useTranslation('common')

  const features = [
    {
      icon: '🔒',
      title: t('feature_private') || 'Free & Private',
      description:
        t('feature_private_desc') ||
        'No account needed. No data sent to servers. Everything stays on your device.',
    },
    {
      icon: '✨',
      title: t('feature_templates') || 'Professional Templates',
      description:
        t('feature_templates_desc') ||
        'Choose from 4 beautifully designed invoice templates that look polished every time.',
    },
    {
      icon: '🌐',
      title: t('feature_languages') || 'Multi-Language',
      description:
        t('feature_languages_desc') ||
        'Create invoices in 6 languages. Perfect for international business.',
    },
  ]

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('why_invoice_dragon') || 'Why Invoice Dragon?'}</h2>
        <p className={styles.subtitle}>
          {t('features_subtitle') || 'Simple, fast, and powerful invoicing'}
        </p>

        <div className={styles.grid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Task 4.2: Create HowItWorks component

**File:** `src/components/Home/HowItWorks.jsx` (NEW)

```javascript
import useTranslation from 'next-translate/useTranslation'
import styles from '@/styles/components/howItWorks.module.scss'

export default function HowItWorks() {
  const { t } = useTranslation('common')

  const steps = [
    {
      number: '1',
      title: t('step_choose') || 'Choose Template',
      description: t('step_choose_desc') || 'Pick from 4 professional invoice designs',
    },
    {
      number: '2',
      title: t('step_fill') || 'Fill Details',
      description: t('step_fill_desc') || 'Enter your company info, client details, and line items',
    },
    {
      number: '3',
      title: t('step_download') || 'Download PDF',
      description: t('step_download_desc') || 'Preview your invoice and download as PDF',
    },
  ]

  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('how_it_works') || 'How It Works'}</h2>

        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {idx < steps.length - 1 && <div className={styles.arrow}>→</div>}
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="/templates" className={styles.ctaButton}>
            {t('get_started') || 'Get Started Now'}
          </a>
        </div>
      </div>
    </section>
  )
}
```

### Task 4.3: Create Footer component

**File:** `src/components/Home/Footer.jsx` (NEW)

```javascript
import useTranslation from 'next-translate/useTranslation'
import styles from '@/styles/components/footer.module.scss'

export default function Footer() {
  const { t } = useTranslation('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.column}>
            <h4>Invoice Dragon</h4>
            <p>{t('footer_tagline') || 'Free invoicing, all yours'}</p>
          </div>

          <div className={styles.column}>
            <h4>{t('footer_links') || 'Links'}</h4>
            <ul>
              <li>
                <a href="/README.md" target="_blank" rel="noopener noreferrer">
                  {t('documentation') || 'Documentation'}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mlaplante/invoice-dragontest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('github') || 'GitHub'}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mlaplante/invoice-dragontest/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('report_issue') || 'Report Issue'}
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>{t('legal') || 'Legal'}</h4>
            <ul>
              <li>
                <a href="#privacy">{t('privacy_policy') || 'Privacy Policy'}</a>
              </li>
              <li>
                <a href="#terms">{t('terms_of_use') || 'Terms of Use'}</a>
              </li>
              <li>
                <a href="#license">{t('license') || 'License (MIT)'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {currentYear} Invoice Dragon. {t('footer_license') || 'Licensed under MIT'}. Made with
            ❤️ by{' '}
            <a href="https://github.com/mlaplante" target="_blank" rel="noopener noreferrer">
              Developers
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### Task 4.4: Create Features styles

**File:** `src/styles/components/features.module.scss` (NEW)

```scss
.features {
  padding: 80px 20px;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #000;
}

.subtitle {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.card {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #007bff;
    transform: translateY(-4px);
  }
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.cardTitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #000;
}

.cardDesc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .features {
    padding: 48px 16px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    margin-bottom: 32px;
  }

  .grid {
    gap: 24px;
  }
}
```

### Task 4.5: Create HowItWorks styles

**File:** `src/styles/components/howItWorks.module.scss` (NEW)

```scss
.howItWorks {
  padding: 80px 20px;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #000;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  align-items: stretch;
  position: relative;
}

.step {
  text-align: center;
  position: relative;
  padding: 24px;
}

.stepNumber {
  width: 56px;
  height: 56px;
  background: #007bff;
  color: white;
  font-size: 24px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.stepTitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #000;
}

.stepDesc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.arrow {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #ccc;

  @media (max-width: 768px) {
    display: none;
  }
}

.cta {
  text-align: center;
}

.ctaButton {
  display: inline-block;
  padding: 16px 40px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
  }
}

@media (max-width: 640px) {
  .howItWorks {
    padding: 48px 16px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .steps {
    gap: 16px;
  }
}
```

### Task 4.6: Create Footer styles

**File:** `src/styles/components/footer.module.scss` (NEW)

```scss
.footer {
  background: #1f2937;
  color: white;
  padding: 48px 20px 24px;
  margin-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #374151;
}

.column {
  h4 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: #e5e7eb;
  }

  p {
    font-size: 13px;
    color: #9ca3af;
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 12px;

      a {
        color: #9ca3af;
        text-decoration: none;
        font-size: 13px;
        transition: color 0.2s;

        &:hover {
          color: #e5e7eb;
        }
      }
    }
  }
}

.bottom {
  text-align: center;
  font-size: 12px;
  color: #6b7280;

  p {
    margin: 0;
  }

  a {
    color: #9ca3af;
    text-decoration: none;

    &:hover {
      color: #e5e7eb;
    }
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 32px 16px 16px;
    margin-top: 48px;
  }

  .content {
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 24px;
  }
}
```

### Task 4.7: Update index.js to use new components

**File:** `src/pages/index.js` (MODIFY)

```javascript
import Head from 'next/head'
import Script from 'next/script'
import Header from '@/components/Header/Header'
import Home from '@/components/Home/Home'
import Features from '@/components/Home/Features'
import HowItWorks from '@/components/Home/HowItWorks'
import Footer from '@/components/Home/Footer'
import styles from '@/styles/Home.module.scss'

export default function Index() {
  return (
    <>
      <Head>
        <title>Invoice Dragon - Free Invoice & Receipt Generator</title>
        <meta
          name="description"
          content="Create professional invoices and receipts instantly. Free, private, no account needed. Available in 6 languages."
        />
      </Head>

      <Header />

      <main className={styles.main}>
        <Home />
        <Features />
        <HowItWorks />
      </main>

      <Footer />

      <Script
        async
        src="https://laplantedevanalytics.netlify.app/script.js"
        data-website-id="9b5a586a-b8e5-45f0-a511-ed98c6a8fa4d"
      />
    </>
  )
}
```

### Task 4.8: Add translation keys

Update all 6 locale files with:

```json
{
  "why_invoice_dragon": "Why Invoice Dragon?",
  "features_subtitle": "Simple, fast, and powerful invoicing",
  "feature_private": "Free & Private",
  "feature_private_desc": "No account needed. No data sent to servers. Everything stays on your device.",
  "feature_templates": "Professional Templates",
  "feature_templates_desc": "Choose from 4 beautifully designed invoice templates that look polished every time.",
  "feature_languages": "Multi-Language",
  "feature_languages_desc": "Create invoices in 6 languages. Perfect for international business.",
  "how_it_works": "How It Works",
  "step_choose": "Choose Template",
  "step_choose_desc": "Pick from 4 professional invoice designs",
  "step_fill": "Fill Details",
  "step_fill_desc": "Enter your company info, client details, and line items",
  "step_download": "Download PDF",
  "step_download_desc": "Preview your invoice and download as PDF",
  "footer_tagline": "Free invoicing, all yours",
  "footer_links": "Links",
  "documentation": "Documentation",
  "github": "GitHub",
  "report_issue": "Report Issue",
  "legal": "Legal",
  "privacy_policy": "Privacy Policy",
  "terms_of_use": "Terms of Use",
  "license": "License",
  "footer_license": "Licensed under MIT. Made with ❤️ by Developers",
  "get_started": "Get Started Now"
}
```

### Task 4.9: Test landing page

```bash
npm run dev
```

Navigate to `/` and verify:

- Features section displays with 3 cards
- HowItWorks section shows 3-step flow
- Footer displays with links and copyright
- All responsive on mobile (cards stack vertically)
- CTA buttons link correctly

### Task 4.10: Commit

```bash
git add src/components/Home/Features.jsx src/components/Home/HowItWorks.jsx src/components/Home/Footer.jsx src/styles/components/ src/pages/index.js locales/*/common.json
git commit -m "feat: enhance landing page with features, how-it-works, and footer

- Add Features section highlighting key value props (3 cards)
- Add HowItWorks section with 3-step process flow
- Add Footer with links to docs, GitHub, and legal pages
- All sections fully responsive and mobile-optimized
- Add 21 new translation keys for all 6 locales
- Improve landing page SEO with better meta description"
```

---

## Feature 3.5: Better Empty States

**Goal:** Guide first-time users with helpful placeholder text, a dismissible tip banner, and animations.

**Approach:** Add placeholder text to form inputs, show tip banner on first visit, add subtle animations.

**Files:**

- Modify: `src/components/Form/Form.jsx`
- Create: `src/components/Form/TipBanner.jsx`
- Modify: `src/components/Form/form.module.scss`
- Modify: `src/utils/storage.js` (add banner dismiss tracking)

### Task 5.1: Write failing test for tip banner

**File:** `src/utils/__tests__/tipBanner.test.js` (NEW)

```javascript
import { saveTipBannerDismissed, isTipBannerDismissed } from '@/utils/storage'

describe('Tip Banner Storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns false when banner not dismissed', () => {
    const isDismissed = isTipBannerDismissed()
    expect(isDismissed).toBe(false)
  })

  test('saves banner dismissed state', () => {
    saveTipBannerDismissed()
    const isDismissed = isTipBannerDismissed()
    expect(isDismissed).toBe(true)
  })

  test('persists dismissed state across sessions', () => {
    localStorage.setItem('invoiceDragon_tipBannerDismissed', 'true')
    const isDismissed = isTipBannerDismissed()
    expect(isDismissed).toBe(true)
  })
})
```

### Task 5.2: Add tip banner functions to storage.js

**File:** `src/utils/storage.js` (MODIFY)

Add these functions:

```javascript
const TIP_BANNER_KEY = 'invoiceDragon_tipBannerDismissed'

export function saveTipBannerDismissed() {
  try {
    localStorage.setItem(TIP_BANNER_KEY, 'true')
    return true
  } catch (error) {
    console.error('Error saving tip banner state:', error)
    return false
  }
}

export function isTipBannerDismissed() {
  try {
    return localStorage.getItem(TIP_BANNER_KEY) === 'true'
  } catch (error) {
    console.error('Error loading tip banner state:', error)
    return false
  }
}
```

### Task 5.3: Run storage tests

```bash
npm test -- src/utils/__tests__/storage.test.js src/utils/__tests__/tipBanner.test.js
```

Expected: All tests pass (21 total + 3 tip banner tests = 24)

### Task 5.4: Create TipBanner component

**File:** `src/components/Form/TipBanner.jsx` (NEW)

```javascript
import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { isTipBannerDismissed, saveTipBannerDismissed } from '@/utils/storage'
import styles from './tipBanner.module.scss'

export default function TipBanner() {
  const { t } = useTranslation('common')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isDismissed = isTipBannerDismissed()
    setIsVisible(!isDismissed)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    saveTipBannerDismissed()
  }

  if (!isVisible) return null

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.icon}>💡</span>
        <div className={styles.text}>
          <p className={styles.message}>
            {t('tip_banner_message') ||
              "Start by entering your company info — it'll be saved for next time"}
          </p>
        </div>
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Dismiss tip">
          ×
        </button>
      </div>
    </div>
  )
}
```

### Task 5.5: Create TipBanner styles

**File:** `src/components/Form/tipBanner.module.scss` (NEW)

```scss
.banner {
  margin-bottom: 24px;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.text {
  flex: 1;
}

.message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
}

.closeBtn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 12px 16px;
    gap: 10px;
  }

  .message {
    font-size: 13px;
  }

  .closeBtn {
    width: 28px;
    height: 28px;
  }
}
```

### Task 5.6: Update Form component with placeholder text

**File:** `src/components/Form/Form.jsx` (MODIFY)

Add TipBanner import:

```javascript
import TipBanner from './TipBanner'
```

Add TipBanner at the top of the form JSX:

```javascript
return (
  <form>
    <TipBanner />
    {/* rest of form */}
  </form>
)
```

Update form inputs with placeholder text. Example for company section:

```javascript
<input
  type="text"
  name="businessName"
  placeholder={t('placeholder_business_name') || 'Your Company Name'}
  value={prefill.businessName || ''}
  onChange={(e) => onFormMod('businessName', e.target.value)}
/>

<input
  type="email"
  name="email"
  placeholder={t('placeholder_email') || 'hello@yourcompany.com'}
  value={prefill.email || ''}
  onChange={(e) => onFormMod('email', e.target.value)}
/>

// ... continue for all other inputs
```

### Task 5.7: Add placeholder translation keys

Update all 6 locale files with:

```json
{
  "tip_banner_message": "Start by entering your company info — it'll be saved for next time",
  "placeholder_business_name": "Your Company Name",
  "placeholder_email": "hello@yourcompany.com",
  "placeholder_address": "Street Address",
  "placeholder_city": "City, State/Country",
  "placeholder_zipcode": "Postal Code",
  "placeholder_phone": "(555) 123-4567",
  "placeholder_website": "https://yourwebsite.com",
  "placeholder_client_name": "Client Company Name",
  "placeholder_client_email": "contact@client.com",
  "placeholder_client_address": "Client Street Address",
  "placeholder_client_city": "Client City, State/Country",
  "placeholder_client_zipcode": "Client Postal Code",
  "placeholder_client_phone": "Client Phone Number",
  "placeholder_invoice_no": "INV-2026-001",
  "placeholder_date": "Select date",
  "placeholder_description": "Service or product description",
  "placeholder_notes": "Payment terms, thank you message, etc."
}
```

### Task 5.8: Run tests and verify

```bash
npm test
```

Expected: 54 tests pass (50 + 3 tip banner + 1 more)

```bash
npm run dev
```

Navigate to `/templates`, verify:

- TipBanner displays on first visit with 💡 icon
- All form inputs have descriptive placeholders
- Banner dismisses when clicking X and doesn't show again
- Banner shows again in incognito/private window
- All text in 6 languages

### Task 5.9: Commit

```bash
git add src/components/Form/TipBanner.jsx src/components/Form/tipBanner.module.scss src/components/Form/Form.jsx src/utils/storage.js locales/*/common.json
git commit -m "feat: improve empty states with placeholders and tip banner

- Add dismissible tip banner with 💡 icon and gradient background
- Add descriptive placeholder text to all form inputs
- Store banner dismiss state in localStorage
- Show tip on first visit, respect user dismiss preference
- Add 17 placeholder translation keys for all 6 locales
- Add smooth slide-in animation for banner
- Improve first-time user guidance and onboarding"
```

---

## Summary

**Phase 3 Implementation complete with 5 features:**

1. **3.1 Download PDF Flow** - Direct download with validation, loading state
2. **3.2 Settings Panel** - Modal with General/Data tabs, export/import, preferences
3. **3.3 Keyboard Shortcuts** - Cmd+P (preview), Cmd+D (download), Escape (close)
4. **3.4 Landing Page** - Features section, HowItWorks flow, Footer with links
5. **3.5 Empty States** - TipBanner, placeholder text, smooth animations

**Total commits:** 5 (one per feature)
**Total tests:** 54+ (new tests for each feature)
**Total translation keys:** 60+ across 6 locales

---

**Plan saved to:** `docs/plans/2026-02-07-phase3-ux-polish.md`

This plan is ready for execution. Two options:

**Option 1: Subagent-Driven (Recommended)** - I dispatch fresh subagent per task, stay in session, review between tasks for fast iteration

- Pros: Tight feedback loop, can adjust on the fly, clear visibility
- Cons: Slower for very straightforward tasks

**Option 2: Parallel Session** - You open new session in worktree with executing-plans skill

- Pros: Faster batch execution, good for clear linear tasks
- Cons: Less feedback, harder to course-correct

**Which approach would you prefer?**
