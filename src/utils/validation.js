/**
 * Validates that required form fields are present
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - List of required field names
 * @returns {Array} Array of missing field names
 */
export function validateRequiredFields(formData, requiredFields) {
  return requiredFields.filter((field) => !formData[field] || String(formData[field]).trim() === '')
}

/**
 * Validates line items
 * @param {Array} rows - Array of line item rows
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export function validateLineItems(rows) {
  const errors = []

  if (!rows || rows.length === 0) {
    errors.push('At least one line item is required')
    return { valid: false, errors }
  }

  rows.forEach((row, index) => {
    if (!row.description || String(row.description).trim() === '') {
      errors.push(`Line item ${index + 1}: Description is required`)
    }
    if (!row.rate || Number(row.rate) <= 0) {
      errors.push(`Line item ${index + 1}: Rate must be greater than 0`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Validates download requirements (same as preview)
 * @param {Object} formData - Form data object
 * @param {Array} rows - Array of line item rows
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export function validateBeforeDownload(formData, rows) {
  const errors = []
  const requiredFields = ['businessName', 'clientName']

  const missingFields = validateRequiredFields(formData, requiredFields)
  if (missingFields.length > 0) {
    missingFields.forEach((field) => {
      errors.push(`${field} is required`)
    })
  }

  const lineItemsValidation = validateLineItems(rows)
  if (!lineItemsValidation.valid) {
    errors.push(...lineItemsValidation.errors)
  }

  return { valid: errors.length === 0, errors }
}
