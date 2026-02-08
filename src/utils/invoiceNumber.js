/**
 * Generate a sequential invoice number
 * @param {string} lastNumber - The last used invoice number
 * @param {string} format - The desired format (default: INV-YYYY-001)
 * @returns {string} The next invoice number
 */
export const generateNextInvoiceNumber = (lastNumber, format = 'INV-YYYY-XXX') => {
  const now = new Date()
  const year = now.getFullYear()

  if (!lastNumber) {
    // Default starting numbers
    if (format === 'INV-YYYY-XXX') return `INV-${year}-001`
    if (format === 'INV-XXX') return `INV-001`
    return '001'
  }

  // Extract number part (matches last group of digits)
  const match = lastNumber.match(/(\d+)(?!.*\d)/)
  if (!match) return lastNumber + '-001'

  const lastDigitStr = match[0]
  const nextDigit = parseInt(lastDigitStr, 10) + 1
  const paddedNext = nextDigit.toString().padStart(lastDigitStr.length, '0')

  // Replace last occurrence of digits with padded next number
  const lastIndex = lastNumber.lastIndexOf(lastDigitStr)
  return (
    lastNumber.substring(0, lastIndex) +
    paddedNext +
    lastNumber.substring(lastIndex + lastDigitStr.length)
  )
}
