import { validateRequiredFields, validateLineItems } from '../validation'

describe('Form validation utilities', () => {
  describe('validateRequiredFields', () => {
    test('returns empty array when all required fields present', () => {
      const formData = {
        businessName: 'Acme Corp',
        email: 'hello@acme.com',
        clientName: 'Client Inc',
      }
      const required = ['businessName', 'email', 'clientName']

      const missing = validateRequiredFields(formData, required)

      expect(missing).toEqual([])
    })

    test('returns missing field names', () => {
      const formData = {
        businessName: 'Acme Corp',
        email: '',
        clientName: '',
      }
      const required = ['businessName', 'email', 'clientName']

      const missing = validateRequiredFields(formData, required)

      expect(missing).toEqual(['email', 'clientName'])
    })

    test('treats whitespace-only values as missing', () => {
      const formData = {
        businessName: '   ',
        email: 'hello@acme.com',
      }
      const required = ['businessName', 'email']

      const missing = validateRequiredFields(formData, required)

      expect(missing).toEqual(['businessName'])
    })

    test('returns all missing when form is empty', () => {
      const formData = {}
      const required = ['businessName', 'email', 'clientName']

      const missing = validateRequiredFields(formData, required)

      expect(missing).toEqual(['businessName', 'email', 'clientName'])
    })

    test('handles undefined values', () => {
      const formData = {
        businessName: undefined,
        email: 'hello@acme.com',
      }
      const required = ['businessName', 'email']

      const missing = validateRequiredFields(formData, required)

      expect(missing).toEqual(['businessName'])
    })
  })

  describe('validateLineItems', () => {
    test('validates valid line items', () => {
      const rows = [
        { description: 'Web Design', rate: 1500, quantity: 1 },
        { description: 'Hosting', rate: 100, quantity: 1 },
      ]

      const result = validateLineItems(rows)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    test('returns error when no line items', () => {
      const result = validateLineItems([])

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('At least one line item is required')
    })

    test('catches missing description', () => {
      const rows = [{ description: '', rate: 100, quantity: 1 }]

      const result = validateLineItems(rows)

      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Description is required'))
    })

    test('catches missing or zero rate', () => {
      const rows = [
        { description: 'Service', rate: 0, quantity: 1 },
        { description: 'Another', rate: undefined, quantity: 1 },
      ]

      const result = validateLineItems(rows)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBe(2)
    })

    test('catches multiple errors across items', () => {
      const rows = [
        { description: '', rate: 0 },
        { description: 'Item 2', rate: 100 },
        { description: '', rate: 50 },
      ]

      const result = validateLineItems(rows)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    test('validates positive rates', () => {
      const rows = [
        { description: 'Service', rate: 100, quantity: 1 },
        { description: 'Product', rate: 0.01, quantity: 1 },
      ]

      const result = validateLineItems(rows)

      expect(result.valid).toBe(true)
    })
  })
})
