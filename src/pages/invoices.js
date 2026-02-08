import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import Toast from '@/components/Toast/Toast'
import { loadInvoices, deleteInvoice } from '@/utils/storage'
import styles from '@/styles/Invoices.module.scss'

export default function Invoices() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [invoices, setInvoices] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setInvoices(loadInvoices())
  }, [])

  const handleDelete = (id) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      deleteInvoice(deleteId)
      setInvoices(loadInvoices())
      setDeleteId(null)
      setToast({ message: 'Invoice deleted successfully', type: 'success' })
    }
  }

  const handleEdit = (invoice) => {
    // Store the invoice to be edited in a temporary key or pass via state
    if (typeof window !== 'undefined') {
      localStorage.setItem('invoiceDragon_editing', JSON.stringify(invoice))
      router.push('/templates?edit=true')
    }
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{t('my_invoices')} - Invoice Dragon</title>
      </Head>
      <Header currentPage={t('my_invoices')} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('my_invoices')}</h1>
          <Link href="/templates" className={styles.createBtn}>
            {t('create_new_invoice')}
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t('no_invoices_found')}</p>
            <Link href="/templates" className={styles.createBtn}>
              {t('get_started')}
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {invoices.map((inv) => (
              <div key={inv.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.invoiceNo}>{inv.InvoiceNo || 'No Number'}</span>
                  <span className={`${styles.status} ${styles[inv.status || 'draft']}`}>
                    {t(inv.status || 'draft')}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div>
                    <strong>{t('client')}:</strong> {inv.clientName || 'N/A'}
                  </div>
                  <div>
                    <strong>{t('total')}:</strong> {inv.currencySymbol}
                    {inv.totalAmount}
                  </div>
                  <div>
                    <strong>{t('date_created')}:</strong>{' '}
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(inv)}
                    className={`${styles.actionBtn} ${styles.edit}`}
                  >
                    {t('edit_invoice')}
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className={`${styles.actionBtn} ${styles.delete}`}
                  >
                    {t('delete_invoice')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <ConfirmDialog
        isOpen={!!deleteId}
        title={t('delete_invoice')}
        message={t('delete_invoice_confirm')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText={t('delete')}
        isDangerous={true}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
