/**
 * Format number with thousand separators
 * @param {number|string} x - Number to format
 * @returns {string} Formatted number with commas
 */
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
