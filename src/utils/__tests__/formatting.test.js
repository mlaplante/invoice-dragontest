import { numberWithCommas } from '../formatting'

describe('Number formatting utility', () => {
  describe('numberWithCommas', () => {
    test('adds commas to numbers with 4+ digits', () => {
      expect(numberWithCommas(1000)).toBe('1,000')
    })

    test('adds multiple commas for large numbers', () => {
      expect(numberWithCommas(1000000)).toBe('1,000,000')
    })

    test('returns same number for numbers under 1000', () => {
      expect(numberWithCommas(100)).toBe('100')
      expect(numberWithCommas(500)).toBe('500')
      expect(numberWithCommas(999)).toBe('999')
    })

    test('handles single digit numbers', () => {
      expect(numberWithCommas(5)).toBe('5')
    })

    test('handles strings as input', () => {
      expect(numberWithCommas('1000')).toBe('1,000')
      expect(numberWithCommas('1000000')).toBe('1,000,000')
    })

    test('handles decimal numbers', () => {
      expect(numberWithCommas(1000.5)).toBe('1,000.5')
      expect(numberWithCommas(1000000.99)).toBe('1,000,000.99')
    })

    test('handles zero', () => {
      expect(numberWithCommas(0)).toBe('0')
    })

    test('handles negative numbers', () => {
      expect(numberWithCommas(-1000)).toBe('-1,000')
      expect(numberWithCommas(-1000000)).toBe('-1,000,000')
    })
  })
})
