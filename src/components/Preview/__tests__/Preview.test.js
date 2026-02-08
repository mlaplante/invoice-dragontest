import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Preview from '../Preview'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  Document: ({ children }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ children }) => <div data-testid="pdf-page">{children}</div>,
  View: ({ children }) => <div data-testid="pdf-view">{children}</div>,
  Text: ({ children }) => <div data-testid="pdf-text">{children}</div>,
  Image: () => <div data-testid="pdf-image" />,
  StyleSheet: { create: (s) => s },
  PDFViewer: ({ children }) => <div data-testid="pdf-viewer">{children}</div>,
  Font: { register: jest.fn() },
}))

describe('Preview Component', () => {
  const mockProps = {
    template: 'template1',
    rows: [{ id: 0, description: 'Test', rate: 100, quantity: 1, amount: '100.00' }],
    currencySymbol: '$',
    formName: 'Invoice',
    branding: { primaryColor: '#000000' },
  }

  test('renders PDFViewer', () => {
    render(<Preview {...mockProps} />)
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
  })
})
