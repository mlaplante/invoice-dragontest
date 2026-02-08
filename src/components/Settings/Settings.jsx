import { useState, useEffect, useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { saveSettings, loadSettings, clearSettings } from '@/utils/settingsStorage'
import {
  saveCompanyInfo,
  loadCompanyInfo,
  clearCompanyInfo,
  clearLogo,
  loadLogo,
  saveLogo,
  loadInvoices,
  loadClients,
} from '@/utils/storage'
import styles from './settings.module.scss'

export default function Settings({ isOpen, onClose, onSettingsChange }) {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})

  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
  }, [])

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

    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value)
    }
  }

  const handleBrandingChange = (key, value) => {
    const updatedBranding = { ...(settings.branding || {}), [key]: value }
    handleSettingChange('branding', updatedBranding)
  }

  const handleExportData = useCallback(() => {
    const allData = {
      settings,
      companyInfo: loadCompanyInfo(),
      logo: loadLogo(),
      invoices: loadInvoices(),
      clients: loadClients(),
      exportedAt: new Date().toISOString(),
      appVersion: '1.1.0',
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
  }, [settings])

  const handleImportData = useCallback(
    (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)

          if (data.settings) {
            saveSettings(data.settings)
            setSettings(data.settings)
            onSettingsChange?.(data.settings)
            if (data.settings.theme) {
              document.documentElement.setAttribute('data-theme', data.settings.theme)
            }
          }
          if (data.companyInfo) saveCompanyInfo(data.companyInfo)
          if (data.logo) saveLogo(data.logo)
          if (data.invoices) {
            localStorage.setItem('invoiceDragonInvoices', JSON.stringify(data.invoices))
          }
          if (data.clients) {
            localStorage.setItem('invoiceDragonClients', JSON.stringify(data.clients))
          }

          alert(t('data_imported') || 'Data imported successfully')
          window.location.reload() // Reload to apply all changes
        } catch (error) {
          console.error('Import error:', error)
          alert(t('import_error') || 'Error importing data')
        }
      }
      reader.readAsText(file)
    },
    [t, onSettingsChange]
  )

  const handleClearAllData = useCallback(() => {
    if (window.confirm(t('clear_all_confirm') || 'This will delete all your data. Are you sure?')) {
      clearSettings()
      clearCompanyInfo()
      clearLogo()
      setSettings({})
      onClose()
    }
  }, [t, onClose])

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
            className={`${styles.tab} ${activeTab === 'branding' ? styles.active : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            {t('branding') || 'Branding'}
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
                <label htmlFor="theme">{t('theme') || 'Theme'}</label>
                <select
                  id="theme"
                  value={settings.theme || 'light'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className={styles.select}
                >
                  <option value="light">{t('light') || 'Light'}</option>
                  <option value="dark">{t('dark') || 'Dark'}</option>
                </select>
              </div>

              <div className={styles.setting}>
                <label htmlFor="autoIncrement">
                  {t('auto_increment_invoices') || 'Auto-increment invoice numbers'}
                </label>
                <input
                  id="autoIncrement"
                  type="checkbox"
                  checked={settings.autoIncrement || false}
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
                  placeholder={t('default_notes_placeholder')}
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className={styles.tabPane}>
              <div className={styles.setting}>
                <label htmlFor="primaryColor">{t('primary_color') || 'Primary Color'}</label>
                <div className={styles.colorPickerGroup}>
                  <input
                    id="primaryColor"
                    type="color"
                    value={settings.branding?.primaryColor || '#3b82f6'}
                    onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={settings.branding?.primaryColor || '#3b82f6'}
                    onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                    className={styles.input__default}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              <div className={styles.setting}>
                <label htmlFor="secondaryColor">{t('secondary_color') || 'Secondary Color'}</label>
                <div className={styles.colorPickerGroup}>
                  <input
                    id="secondaryColor"
                    type="color"
                    value={settings.branding?.secondaryColor || '#1e40af'}
                    onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={settings.branding?.secondaryColor || '#1e40af'}
                    onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                    className={styles.input__default}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              <div className={styles.setting}>
                <label htmlFor="fontFamily">{t('font_family') || 'Font Family'}</label>
                <select
                  id="fontFamily"
                  value={settings.branding?.fontFamily || 'Helvetica'}
                  onChange={(e) => handleBrandingChange('fontFamily', e.target.value)}
                  className={styles.select}
                >
                  <option value="Helvetica">Helvetica</option>
                  <option value="Courier">Courier</option>
                  <option value="Times-Roman">Times New Roman</option>
                </select>
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

              <div className={styles.dataActions}>
                <input
                  type="file"
                  id="importData"
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: 'none' }}
                />
                <button
                  className={styles.btnPrimary}
                  onClick={() => document.getElementById('importData').click()}
                >
                  {t('import_data') || 'Import Data (JSON)'}
                </button>
                <p className={styles.hint}>
                  {t('import_hint') || 'Restore everything from a backup file'}
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
