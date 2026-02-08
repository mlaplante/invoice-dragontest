// Utility functions for localStorage operations

const COMPANY_INFO_KEY = 'invoiceDragonCompanyInfo'
const LOGO_KEY = 'invoiceDragonLogo'

/**
 * Save company information to localStorage
 * @param {Object} companyInfo - Company information object
 */
export const saveCompanyInfo = (companyInfo) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(companyInfo))
    } catch (error) {
      console.error('Error saving company info:', error)
    }
  }
}

/**
 * Load company information from localStorage
 * @returns {Object|null} Company information object or null if not found
 */
export const loadCompanyInfo = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(COMPANY_INFO_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Error loading company info:', error)
      return null
    }
  }
  return null
}

/**
 * Clear company information from localStorage
 */
export const clearCompanyInfo = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(COMPANY_INFO_KEY)
    } catch (error) {
      console.error('Error clearing company info:', error)
    }
  }
}

/**
 * Save logo to localStorage
 * @param {string} logoData - Base64 encoded logo data
 */
export const saveLogo = (logoData) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOGO_KEY, logoData)
    } catch (error) {
      console.error('Error saving logo:', error)
    }
  }
}

/**
 * Load logo from localStorage
 * @returns {string|null} Base64 encoded logo data or null if not found
 */
export const loadLogo = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(LOGO_KEY)
    } catch (error) {
      console.error('Error loading logo:', error)
      return null
    }
  }
  return null
}

/**
 * Clear logo from localStorage
 */
export const clearLogo = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOGO_KEY)
    } catch (error) {
      console.error('Error clearing logo:', error)
    }
  }
}

const INVOICES_KEY = 'invoiceDragonInvoices'

/**
 * Save an invoice to history
 * @param {Object} invoiceData - Full invoice data
 */
export const saveInvoice = (invoiceData) => {
  if (typeof window !== 'undefined') {
    try {
      const invoices = loadInvoices()
      const index = invoices.findIndex((inv) => inv.id === invoiceData.id)

      if (index !== -1) {
        invoices[index] = { ...invoiceData, updatedAt: new Date().toISOString() }
      } else {
        invoices.push({
          ...invoiceData,
          id: invoiceData.id || `inv_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices))
      return true
    } catch (error) {
      console.error('Error saving invoice:', error)
      return false
    }
  }
  return false
}

/**
 * Load all invoices from history
 * @returns {Array} Array of invoices
 */
export const loadInvoices = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(INVOICES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading invoices:', error)
      return []
    }
  }
  return []
}

/**
 * Delete an invoice from history
 * @param {string} id - Invoice ID
 */
export const deleteInvoice = (id) => {
  if (typeof window !== 'undefined') {
    try {
      const invoices = loadInvoices()
      const filtered = invoices.filter((inv) => inv.id !== id)
      localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return false
    }
  }
  return false
}

const CLIENTS_KEY = 'invoiceDragonClients'

/**
 * Save a client to history
 * @param {Object} clientData - Client information
 */
export const saveClient = (clientData) => {
  if (typeof window !== 'undefined') {
    try {
      const clients = loadClients()
      const index = clients.findIndex((c) => c.name.toLowerCase() === clientData.name.toLowerCase())

      if (index !== -1) {
        clients[index] = {
          ...clients[index],
          ...clientData,
          updatedAt: new Date().toISOString(),
        }
      } else {
        clients.push({
          ...clientData,
          id: clientData.id || `client_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
      return true
    } catch (error) {
      console.error('Error saving client:', error)
      return false
    }
  }
  return false
}

/**
 * Load all clients
 * @returns {Array} Array of clients
 */
export const loadClients = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CLIENTS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading clients:', error)
      return []
    }
  }
  return []
}
