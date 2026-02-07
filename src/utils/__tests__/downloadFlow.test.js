import { validateBeforeDownload } from '../validation'

describe('Download PDF Flow', () => {
  test('allows download when businessName and clientName are present', () => {
    const formData = {
      businessName: 'Dragon Corp',
      clientName: 'Client Inc.',
    }
    const rows = [{ id: 0, description: 'Service', rate: 100, quantity: 1, amount: '100.00' }]

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(true)
  })

  test('prevents download when businessName is missing', () => {
    const formData = { businessName: '', clientName: 'Client Inc.' }
    const rows = [{ id: 0, description: 'Service', rate: 100, quantity: 1, amount: '100.00' }]

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('businessName is required')
  })

  test('prevents download when no line items present', () => {
    const formData = { businessName: 'Dragon Corp', clientName: 'Client Inc.' }
    const rows = []

    const result = validateBeforeDownload(formData, rows)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one line item is required')
  })
})
