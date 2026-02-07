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
                  placeholder={t('default_notes_placeholder')}
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
