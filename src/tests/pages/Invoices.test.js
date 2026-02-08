import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Invoices from '../../pages/invoices'
import * as storage from '@/utils/storage'
import { useRouter } from 'next/router'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

// Mock storage
jest.mock('@/utils/storage', () => ({
  loadInvoices: jest.fn(),
  deleteInvoice: jest.fn(),
}))

// Mock components
jest.mock('@/components/Header/Header', () => {
  const Header = () => <div data-testid="header" />
  Header.displayName = 'Header'
  return Header
})
jest.mock('@/components/Footer/Footer', () => {
  const Footer = () => <div data-testid="footer" />
  Footer.displayName = 'Footer'
  return Footer
})
jest.mock('@/components/ConfirmDialog/ConfirmDialog', () => {
  const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title }) =>
    isOpen ? (
      <div data-testid="confirm-dialog" data-title={title}>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ConfirmDialog.displayName = 'ConfirmDialog'
  return ConfirmDialog
})

// Mock react-pdf components
jest.mock('@react-pdf/renderer', () => {
  const PDFViewer = ({ children }) => <div data-testid="pdf-viewer">{children}</div>
  const Document = ({ children }) => <div data-testid="pdf-document">{children}</div>
  const Page = ({ children }) => <div data-testid="pdf-page">{children}</div>
  const Text = ({ children }) => <div data-testid="pdf-text">{children}</div>
  const View = ({ children }) => <div data-testid="pdf-view">{children}</div>
  const Image = () => <div data-testid="pdf-image" />

  PDFViewer.displayName = 'PDFViewer'
  Document.displayName = 'Document'
  Page.displayName = 'Page'
  Text.displayName = 'Text'
  View.displayName = 'View'
  Image.displayName = 'Image'

  return {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet: { create: (s) => s },
    Font: { register: jest.fn() },
    Image,
  }
})

describe('Invoices Page', () => {
  const mockRouter = { push: jest.fn() }

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  test('renders empty state when no invoices', () => {
    storage.loadInvoices.mockReturnValue([])
    render(<Invoices />)
    expect(screen.getByText('no_invoices_found')).toBeInTheDocument()
  })

  test('renders list of invoices', () => {
    const mockInvoices = [
      {
        id: 'inv_1',
        InvoiceNo: 'INV-001',
        clientName: 'Client A',
        totalAmount: '100.00',
        createdAt: new Date().toISOString(),
      },
    ]
    storage.loadInvoices.mockReturnValue(mockInvoices)
    render(<Invoices />)
    expect(screen.getByText('INV-001')).toBeInTheDocument()
    expect(screen.getByText('Client A')).toBeInTheDocument()
  })

  test('handles invoice deletion', () => {
    storage.loadInvoices.mockReturnValue([
      { id: 'inv_1', InvoiceNo: 'INV-001', createdAt: new Date().toISOString() },
    ])
    render(<Invoices />)

    fireEvent.click(screen.getByText('delete_invoice'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Confirm'))
    expect(storage.deleteInvoice).toHaveBeenCalledWith('inv_1')
  })

  test('filters invoices by search term', () => {
    const mockInvoices = [
      {
        id: 'inv_1',
        InvoiceNo: 'INV-001',
        clientName: 'Client A',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'inv_2',
        InvoiceNo: 'INV-002',
        clientName: 'Other',
        createdAt: new Date().toISOString(),
      },
    ]
    storage.loadInvoices.mockReturnValue(mockInvoices)
    render(<Invoices />)

    const searchInput = screen.getByPlaceholderText('search_invoices')
    fireEvent.change(searchInput, { target: { value: 'Client' } })

    expect(screen.getByText('INV-001')).toBeInTheDocument()
    expect(screen.queryByText('INV-002')).not.toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'NonExistent' } })
    expect(screen.getByText('no_results_found')).toBeInTheDocument()
  })

  test('handles invoice editing', () => {
    const invoice = { id: 'inv_1', InvoiceNo: 'INV-001', createdAt: new Date().toISOString() }
    storage.loadInvoices.mockReturnValue([invoice])
    render(<Invoices />)

    fireEvent.click(screen.getByText('edit_invoice'))
    expect(mockRouter.push).toHaveBeenCalledWith('/templates?edit=true')
  })

  test('cancels delete all', () => {
    storage.loadInvoices.mockReturnValue([{ id: 'inv_1' }])
    render(<Invoices />)

    fireEvent.click(screen.getByText('delete_all'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument()
  })

  test('clears all invoices after confirmation', async () => {
    storage.loadInvoices.mockReturnValue([
      { id: 'inv_1', InvoiceNo: 'INV-001', createdAt: new Date().toISOString() },
    ])
    const { rerender } = render(<Invoices />)

    fireEvent.click(screen.getByText('delete_all'))

    const dialog = screen.getByTestId('confirm-dialog')
    expect(dialog).toHaveAttribute('data-title', 'delete_all')

    // Simulate confirming delete all
    storage.loadInvoices.mockReturnValue([])
    fireEvent.click(screen.getByText('Confirm'))

    rerender(<Invoices />)

    await waitFor(() => {
      expect(screen.getByText('no_invoices_found')).toBeInTheDocument()
    })
  })
})
