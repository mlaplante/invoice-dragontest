import { generateNextInvoiceNumber } from '../invoiceNumber'

describe('invoiceNumber utility', () => {
  test('generates default number when no last number provided (INV-YYYY-XXX)', () => {
    const year = new Date().getFullYear()
    expect(generateNextInvoiceNumber(null, 'INV-YYYY-XXX')).toBe(`INV-${year}-001`)
  })

  test('generates default number when no last number provided (INV-XXX)', () => {
    expect(generateNextInvoiceNumber(null, 'INV-XXX')).toBe('INV-001')
  })

  test('increments standard number', () => {
    expect(generateNextInvoiceNumber('INV-2026-001')).toBe('INV-2026-002')
  })

  test('increments number with different length padding', () => {
    expect(generateNextInvoiceNumber('INV-01')).toBe('INV-02')
    expect(generateNextInvoiceNumber('INV-0001')).toBe('INV-0002')
  })

  test('handles number overflow (99 to 100)', () => {
    expect(generateNextInvoiceNumber('INV-99')).toBe('INV-100')
  })

  test('handles number overflow with padding (099 to 100)', () => {
    expect(generateNextInvoiceNumber('INV-099')).toBe('INV-100')
  })

  test('handles complex formats with multiple numbers (uses last group)', () => {
    expect(generateNextInvoiceNumber('ABC-123-DEF-456')).toBe('ABC-123-DEF-457')
  })

  test('returns lastNumber + -001 if no digits found', () => {
    expect(generateNextInvoiceNumber('INV-NO-DIGITS')).toBe('INV-NO-DIGITS-001')
  })
})
