import Head from 'next/head'
import Script from 'next/script'

import { useState, useEffect, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDF } from '../components/Preview/Preview'
import InvoiceTemplate from '../components/InvoiceTemplate/InvoiceTemplate'
import CurrencySelector from '../components/Dropdown/CurrencySelector'
import MoreMenu from '../components/MoreMenu'
import styles from '@/styles/Home.module.scss'
import Form from '../components/Form/Form'
import Header from '@/components/Header/Header'
import Toast from '../components/Toast/Toast'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'
import dynamic from 'next/dynamic'

const Previewed = dynamic(() => import('../components/Preview/Preview'), {
  ssr: false,
})

import useTranslation from 'next-translate/useTranslation'
import {
  saveCompanyInfo,
  loadCompanyInfo,
  clearCompanyInfo,
  saveLogo,
  loadLogo,
  clearLogo,
} from '../utils/storage'
import { numberWithCommas } from '../utils/formatting'
import {
  validateRequiredFields,
  validateLineItems,
  validateBeforeDownload,
} from '../utils/validation'

// Company information fields that should be persisted
const COMPANY_FIELDS = ['businessName', 'email', 'address', 'city', 'zipcode', 'phone', 'website']

const Templates = () => {
  const { t } = useTranslation('common')

  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({ formName: 'Invoice' })
  const [rows, setRows] = useState(Array(1).fill({ id: 0, quantity: 1, amount: '0.00' }))
  const [logo, setLogo] = useState(null)
  const [logoUpdated, setLogoUpdated] = useState(false)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [template, setTemplate] = useState(null)
  const [templateSelected, setTemplateSelected] = useState(false)
  const [total, setTotal] = useState(0)
  const [toast, setToast] = useState(null)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  // Load saved company information and logo on mount
  useEffect(() => {
    const savedCompanyInfo = loadCompanyInfo()
    const savedLogo = loadLogo()

    if (savedCompanyInfo) {
      setFormData((prevData) => ({
        ...prevData,
        ...savedCompanyInfo,
      }))
    }

    if (savedLogo) {
      setLogo(savedLogo)
      setLogoUpdated(true)
    }
  }, [])

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value)
    if (e.target.value) setTemplateSelected(true)

    setTimeout(() => {
      window.scroll({
        top: isMobile ? 1800 : 500,
        behavior: 'smooth',
      })
    }, 400)
  }

  const handleLogoUpdate = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogo(reader.result)
        setLogoUpdated(true)
        saveLogo(reader.result) // Save logo to localStorage
        showToast(t('logo_saved') || 'Logo saved successfully')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogo(null)
    setLogoUpdated(false)
    clearLogo()
    showToast(t('logo_removed') || 'Logo removed')
  }

  const handleLoadExampleData = () => {
    const exampleData = {
      formName: 'Invoice',
      businessName: 'Dragon Corp',
      email: 'hello@dragoncorp.com',
      address: '123 Fire Breath Way',
      city: 'Magical City, Dreamland',
      zipcode: '99999',
      phone: '(555) 123-4567',
      website: 'https://dragoncorp.com',
      clientName: 'Future Client Inc.',
      clientEmail: 'contact@futureclient.com',
      clientAddress: '456 Opportunity Ave',
      clientCity: 'Business Bay, Commerce',
      clientZipcode: '11111',
      clientPhone: '(555) 987-6543',
      date: new Date().toISOString().split('T')[0],
      InvoiceNo: 'INV-2026-001',
      notes: 'Thank you for your business! Please pay within 30 days.',
    }

    const exampleRows = [
      {
        id: 0,
        description: 'Web Design Services',
        details: 'Professional website design and development',
        rate: 1500,
        quantity: 1,
        amount: '1500.00',
      },
      {
        id: 1,
        description: 'Branding Package',
        details: 'Logo, typography, and color palette',
        rate: 800,
        quantity: 1,
        amount: '800.00',
      },
      {
        id: 2,
        description: 'Consulting',
        details: 'Strategy sessions (per hour)',
        rate: 100,
        quantity: 5,
        amount: '500.00',
      },
    ]

    setFormData(exampleData)
    setRows(exampleRows)
    showToast(t('example_data_loaded') || 'Example data loaded')
  }

  const handleFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Save company information when it changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const companyInfo = {}
      let hasData = false

      COMPANY_FIELDS.forEach((field) => {
        if (formData[field]) {
          companyInfo[field] = formData[field]
          hasData = true
        }
      })

      if (hasData) {
        saveCompanyInfo(companyInfo)
        // Only show toast if it's an automatic save after initial load
        if (templateSelected) {
          showToast(t('info_saved') || 'Company info saved automatically')
        }
      }
    }, 1000) // Debounce for 1000ms

    return () => clearTimeout(timeoutId)
  }, [formData, templateSelected, showToast, t])

  const handleToggle = () => {
    if (!showPreview) {
      // Validate required fields
      const requiredFields = ['businessName', 'clientName']
      const missingFields = validateRequiredFields(formData, requiredFields)

      // Validate line items
      const lineItemsValidation = validateLineItems(rows)

      if (missingFields.length > 0 || !lineItemsValidation.valid) {
        const errors = [
          ...missingFields.map((field) => `${field} is required`),
          ...lineItemsValidation.errors,
        ]
        showToast(errors.join(' • '), 'error')
        return
      }

      showToast(t('generating_preview') || 'Generating PDF preview...', 'loading')
      setTimeout(() => {
        setShowPreview(true)
      }, 1000)
    } else {
      setShowPreview(false)
    }
  }

  // Table Functions
  const handleTableUpdate = (e, id, amount) => {
    setRows((prevRows) => {
      const updateTable = [...prevRows]
      const currentRowIndex = updateTable.findIndex((row) => row.id === id)
      updateTable[currentRowIndex] = {
        ...updateTable[currentRowIndex],
        [e.target.name]: e.target.value,
      }
      if (amount !== undefined) {
        updateTable[currentRowIndex].amount = amount
      }
      if (e.target.name === 'rate' || e.target.name === 'quantity') {
        updateTable[currentRowIndex][e.target.name] = Number(e.target.value)
      }
      return updateTable
    })
  }
  const handleRowAdd = () => {
    const lastId = rows.length ? rows[rows.length - 1].id : 0
    setRows((prevRows) => [...prevRows, { id: lastId + 1, quantity: 1, amount: '0.00' }])
  }

  const handleRowRemove = (id) => {
    setRows((prevRows) => prevRows.filter((item) => item.id !== id))
  }
  const handleCurrencyModify = (curr) => {
    setCurrencyCode(curr.code)
    setCurrencySymbol(curr.symbol)
  }

  const handleClearSavedData = () => {
    setShowClearDialog(true)
  }

  const handleConfirmClear = () => {
    setShowClearDialog(false)
    clearCompanyInfo()
    clearLogo()
    // Reset company fields in formData to empty strings
    setFormData((prevData) => {
      const newData = { ...prevData }
      COMPANY_FIELDS.forEach((field) => {
        newData[field] = ''
      })
      return newData
    })
    // Reset logo
    setLogo(null)
    setLogoUpdated(false)
    showToast(t('all_data_cleared') || '✓ All data cleared')
  }

  const handleCancelClear = () => {
    setShowClearDialog(false)
  }

  const calculateTotal = useCallback(() => {
    let sum = 0
    rows.forEach((row) => {
      sum += parseFloat(row.amount)
    })
    setTotal(numberWithCommas(sum.toFixed(2)))
  }, [rows])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const pdf = (
    <PDF
      template={template}
      rows={rows}
      email={formData.email}
      businessName={formData.businessName}
      formName={formData.formName}
      logo={logo}
      logoUpdated={logoUpdated}
      address={formData.address}
      city={formData.city}
      zipcode={formData.zipcode}
      phone={formData.phone}
      owner={formData.owner}
      clientName={formData.clientName}
      clientEmail={formData.clientEmail}
      clientAddress={formData.clientAddress}
      clientCity={formData.clientCity}
      clientZipcode={formData.clientZipcode}
      clientPhone={formData.clientPhone}
      date={formData.date}
      InvoiceNo={formData.InvoiceNo}
      website={formData.website}
      notes={formData.notes}
      currencySymbol={currencySymbol}
      totalAmount={total}
    />
  )

  return (
    <>
      <Head>
        <title>Invoice Dragon</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://laplantedevanalytics.netlify.app/script.js"
          data-website-id="9b5a586a-b8e5-45f0-a511-ed98c6a8fa4d"
        ></script>
      </Head>
      <main>
        <div className={styles.template__wrapper}>
          <div className={styles.header}>
            <Header />
          </div>
          <div className={styles.container}>
            <InvoiceTemplate template={template} changeTemplate={handleTemplateChange} />
            {templateSelected && (
              <div className={styles.template__section}>
                <div className={styles.main__section}>
                  {!showPreview && (
                    <Form
                      prefill={formData}
                      rows={rows}
                      logo={logo}
                      updateLogo={handleLogoUpdate}
                      logoUpdated={logoUpdated}
                      currencySymbol={currencySymbol}
                      onFormMod={handleFormChange}
                      onPreviewToggle={handleToggle}
                      onRowAdd={handleRowAdd}
                      onRowRemove={handleRowRemove}
                      onTableUpdate={handleTableUpdate}
                      onRemoveLogo={handleRemoveLogo}
                    />
                  )}

                  {showPreview && (
                    <Previewed
                      {...formData}
                      rows={rows}
                      logo={logo}
                      logoUpdated={logoUpdated}
                      template={template}
                      currencySymbol={currencySymbol}
                      onPreviewToggle={handleToggle}
                    />
                  )}
                </div>
                <div className={styles.action__section}>
                  <div className={styles.actions}>
                    {!isMobile && <h3 className={styles.action__title}>{t('actions')}</h3>}
                    <button className={styles.action__btn} onClick={handleToggle}>
                      {showPreview ? `${t('back_to_edit')}` : `${t('preview_invoice')}`}
                    </button>
                    <PDFDownloadLink
                      document={pdf}
                      fileName={`${formData.clientName}_${formData.formName}.pdf`}
                      style={{ width: '100%', flex: isMobile ? 1 : 'unset' }}
                    >
                      {({ blob, url, loading, error }) => {
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

                        return (
                          <button
                            className={`${styles.action__btn} ${loading ? styles.loading : ''}`}
                            onClick={handleDownloadClick}
                            disabled={loading}
                          >
                            {loading ? t('downloading') || 'Downloading...' : t('download_pdf')}
                          </button>
                        )
                      }}
                    </PDFDownloadLink>
                    {!isMobile && (
                      <CurrencySelector
                        currencyCode={currencyCode}
                        currencySymbol={currencySymbol}
                        onCurrencyModify={handleCurrencyModify}
                      />
                    )}
                    <MoreMenu
                      onClearData={handleClearSavedData}
                      onLoadExampleData={handleLoadExampleData}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        <ConfirmDialog
          isOpen={showClearDialog}
          title={t('clear_saved_data') || 'Clear Saved Data'}
          message={
            t('clear_saved_data_confirm') ||
            'Are you sure you want to clear your saved company information and logo?'
          }
          confirmText="Clear"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleConfirmClear}
          onCancel={handleCancelClear}
        />
      </main>
    </>
  )
}

export default Templates
