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
