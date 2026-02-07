import {
  saveSettings,
  loadSettings,
  getDefaultSettings,
  clearSettings,
} from '@/utils/settingsStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

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

  test('clears settings from localStorage', () => {
    saveSettings({ currency: 'EUR' })
    clearSettings()
    const loaded = loadSettings()
    expect(loaded.currency).toBe('USD') // Should fall back to defaults
  })
})
