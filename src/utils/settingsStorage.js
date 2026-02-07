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
