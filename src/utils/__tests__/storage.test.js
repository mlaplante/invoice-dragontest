import {
  saveCompanyInfo,
  loadCompanyInfo,
  clearCompanyInfo,
  saveLogo,
  loadLogo,
  clearLogo,
} from '../storage'

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

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  // saveCompanyInfo tests
  describe('saveCompanyInfo', () => {
    test('saves company information to localStorage', () => {
      const companyData = { businessName: 'Acme Corp', email: 'hello@acme.com' }

      saveCompanyInfo(companyData)

      const saved = JSON.parse(localStorage.getItem('invoiceDragonCompanyInfo'))
      expect(saved).toEqual(companyData)
    })

    test('overwrites existing company information', () => {
      const firstData = { businessName: 'Company 1' }
      const secondData = { businessName: 'Company 2' }

      saveCompanyInfo(firstData)
      saveCompanyInfo(secondData)

      const saved = JSON.parse(localStorage.getItem('invoiceDragonCompanyInfo'))
      expect(saved).toEqual(secondData)
    })

    test('handles empty object', () => {
      saveCompanyInfo({})

      const saved = JSON.parse(localStorage.getItem('invoiceDragonCompanyInfo'))
      expect(saved).toEqual({})
    })

    test('handles complex nested objects', () => {
      const complexData = {
        businessName: 'Acme',
        address: { street: '123 Main', city: 'NYC' },
        tags: ['invoicing', 'professional'],
      }

      saveCompanyInfo(complexData)

      const saved = JSON.parse(localStorage.getItem('invoiceDragonCompanyInfo'))
      expect(saved).toEqual(complexData)
    })
  })

  // loadCompanyInfo tests
  describe('loadCompanyInfo', () => {
    test('loads company information from localStorage', () => {
      const companyData = { businessName: 'Acme Corp', email: 'hello@acme.com' }
      localStorage.setItem('invoiceDragonCompanyInfo', JSON.stringify(companyData))

      const loaded = loadCompanyInfo()

      expect(loaded).toEqual(companyData)
    })

    test('returns null when no company info saved', () => {
      const loaded = loadCompanyInfo()

      expect(loaded).toBeNull()
    })

    test('returns null when localStorage is empty', () => {
      localStorage.setItem('invoiceDragonCompanyInfo', '')

      const loaded = loadCompanyInfo()

      expect(loaded).toBeNull()
    })

    test('handles corrupted JSON gracefully', () => {
      localStorage.setItem('invoiceDragonCompanyInfo', 'invalid json {')

      const loaded = loadCompanyInfo()

      expect(loaded).toBeNull()
    })
  })

  // clearCompanyInfo tests
  describe('clearCompanyInfo', () => {
    test('removes company information from localStorage', () => {
      const companyData = { businessName: 'Acme Corp' }
      localStorage.setItem('invoiceDragonCompanyInfo', JSON.stringify(companyData))

      clearCompanyInfo()

      expect(localStorage.getItem('invoiceDragonCompanyInfo')).toBeNull()
    })

    test('handles clearing when nothing exists', () => {
      expect(() => clearCompanyInfo()).not.toThrow()
    })
  })

  // saveLogo tests
  describe('saveLogo', () => {
    test('saves logo data to localStorage', () => {
      const logoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEA'

      saveLogo(logoData)

      expect(localStorage.getItem('invoiceDragonLogo')).toBe(logoData)
    })

    test('overwrites existing logo', () => {
      const logo1 = 'data:image/png;base64,logo1'
      const logo2 = 'data:image/png;base64,logo2'

      saveLogo(logo1)
      saveLogo(logo2)

      expect(localStorage.getItem('invoiceDragonLogo')).toBe(logo2)
    })

    test('handles large base64 strings', () => {
      const largeBase64 = 'data:image/png;base64,' + 'A'.repeat(10000)

      saveLogo(largeBase64)

      expect(localStorage.getItem('invoiceDragonLogo')).toBe(largeBase64)
    })
  })

  // loadLogo tests
  describe('loadLogo', () => {
    test('loads logo data from localStorage', () => {
      const logoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEA'
      localStorage.setItem('invoiceDragonLogo', logoData)

      const loaded = loadLogo()

      expect(loaded).toBe(logoData)
    })

    test('returns null when no logo saved', () => {
      const loaded = loadLogo()

      expect(loaded).toBeNull()
    })

    test('returns empty string when logo is empty', () => {
      localStorage.setItem('invoiceDragonLogo', '')

      const loaded = loadLogo()

      expect(loaded).toBe('')
    })
  })

  // clearLogo tests
  describe('clearLogo', () => {
    test('removes logo from localStorage', () => {
      const logoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEA'
      localStorage.setItem('invoiceDragonLogo', logoData)

      clearLogo()

      expect(localStorage.getItem('invoiceDragonLogo')).toBeNull()
    })

    test('handles clearing when nothing exists', () => {
      expect(() => clearLogo()).not.toThrow()
    })
  })
})
