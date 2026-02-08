import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Template2 from '../Template2'
import Template3 from '../Template3'
import Template4 from '../Template4'

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  Page: ({ children }) => <div data-testid="pdf-page">{children}</div>,
  View: ({ children }) => <div data-testid="pdf-view">{children}</div>,
  Text: ({ children }) => <div data-testid="pdf-text">{children}</div>,
  Image: () => <div data-testid="pdf-image" />,
  StyleSheet: { create: (s) => s },
  Font: { register: jest.fn() },
}))

const mockProps = {
  rows: [{ id: 0, description: 'Test', rate: 100, quantity: 1, amount: '100.00' }],
  currencySymbol: '$',
  branding: { primaryColor: '#000000', secondaryColor: '#333333', fontFamily: 'Courier' },
  formType: 'receipt',
}

describe('Other Templates', () => {
  test('Template2 renders', () => {
    render(<Template2 {...mockProps} />)
  })
  test('Template3 renders', () => {
    render(<Template3 {...mockProps} />)
  })
  test('Template4 renders', () => {
    render(<Template4 {...mockProps} />)
  })
})
