import Head from 'next/head'
import Script from 'next/script'

import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDF } from '../components/Preview/Preview'
import InvoiceTemplate from '../components/InvoiceTemplate/InvoiceTemplate'
import CurrencySelector from '../components/Dropdown/CurrencySelector'
import MoreMenu from '../components/MoreMenu'
import styles from '@/styles/Home.module.scss'
import Form from '../components/Form/Form'
import Header from '@/components/Header/Header'
import logoP from '../assets/images/placeholder-image.png'
import Previewed from '../components/Preview/Preview'

import useTranslation from 'next-translate/useTranslation'
import {
  saveCompanyInfo,
  loadCompanyInfo,
  clearCompanyInfo,
  saveLogo,
  loadLogo,
  clearLogo,
} from '../utils/storage'

// Company information fields that should be persisted
const COMPANY_FIELDS = ['businessName', 'email', 'address', 'city', 'zipcode', 'phone', 'website']

const Templates = () => {
  const { t, lang } = useTranslation('common')
  // const [service, setService] = useState('invoice');

  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({ formName: 'Invoice' })
  const [rows, setRows] = useState(Array(1).fill({ id: 0, quantity: 1, amount: '0.00' }))
  const [logo, setLogo] = useState(logoP)
  const [logoUpdated, setLogoUpdated] = useState(false)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [template, setTemplate] = useState(null)
  const [templateSelected, setTemplateSelected] = useState(false)
  const [total, setTotal] = useState(0)

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

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
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogo(reader.result)
        setLogoUpdated(true)
        saveLogo(reader.result) // Save logo to localStorage
      }
    }
    reader.readAsDataURL(e.target.files[0])
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
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [formData])

  const handleToggle = () => {
    setShowPreview(!showPreview)
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
    if (
      confirm(
        t('clear_saved_data_confirm') ||
          'Are you sure you want to clear your saved company information and logo?'
      )
    ) {
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
      setLogo(logoP)
      setLogoUpdated(false)
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const calculateTotal = () => {
    let sum = 0
    rows.forEach((row) => {
      sum += parseFloat(row.amount)
    })
    setTotal(numberWithCommas(sum.toFixed(2)))
  }

  useEffect(() => {
    calculateTotal()
  }, [rows])

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
                    {t('actions')}
                    <br />
                    <br />
                    <button className={styles.action__btn} onClick={handleToggle}>
                      {showPreview ? `${t('back_to_edit')}` : `${t('preview_invoice')}`}
                    </button>
                    <br />
                    <br />
                    <div>
                      <PDFDownloadLink
                        document={pdf}
                        fileName={`${formData.clientName}_${formData.formName}.pdf`}
                      >
                        {({ blob, url, loading, error }) => (
                          <button className={styles.action__btn} disabled={!showPreview}>
                            {t('download_pdf')}
                          </button>
                        )}
                      </PDFDownloadLink>
                    </div>
                    <br />
                    <br />
                    <CurrencySelector
                      currencyCode={currencyCode}
                      currencySymbol={currencySymbol}
                      onCurrencyModify={handleCurrencyModify}
                    />
                    <br />
                    <MoreMenu onClearData={handleClearSavedData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Templates
