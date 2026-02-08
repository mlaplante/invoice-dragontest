import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Templates from '../templates'
import * as storage from '@/utils/storage'
import * as settingsStorage from '@/utils/settingsStorage'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}))

// Mock next/dynamic
jest.mock('next/dynamic', () => {
  const MockDynamic = (fn) => {
    const Component = (props) => {
      const [C, setC] = React.useState(null)
      React.useEffect(() => {
        let mounted = true
        fn().then((mod) => {
          if (mounted) setC(() => mod.default)
        })
        return () => {
          mounted = false
        }
      }, [])
      return C ? <C {...props} /> : <div data-testid="loading-dynamic" />
    }
    Component.displayName = 'MockDynamicComponent'
    return Component
  }
  return {
    __esModule: true,
    default: MockDynamic,
  }
})

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }) => children({ loading: false }),
  Font: { register: jest.fn() },
}))

// Mock storage utilities
jest.mock('@/utils/storage', () => ({
  loadCompanyInfo: jest.fn(() => ({})),
  loadLogo: jest.fn(() => null),
  loadInvoices: jest.fn(() => []),
  loadClients: jest.fn(() => []),
  saveInvoice: jest.fn(() => true),
  saveLogo: jest.fn(),
  clearCompanyInfo: jest.fn(),
  clearLogo: jest.fn(),
  saveCompanyInfo: jest.fn(),
}))

jest.mock('@/utils/settingsStorage', () => ({
  loadSettings: jest.fn(() => ({
    theme: 'light',
    branding: { primaryColor: '#000000' },
  })),
  saveSettings: jest.fn(),
}))

describe('Templates Page', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test('renders initial state with template selection', () => {
    render(<Templates />)
    expect(screen.getByText('choose_template')).toBeInTheDocument()
  })

  test('handles template selection', async () => {
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    expect(await screen.findByText('bill_to')).toBeInTheDocument()
  })

  test('handles logo upload', async () => {
    render(<Templates />)
    // Select template first to show form
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    // We need to mock FileReader
    const mockFileReaderInstance = {
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,test',
      readyState: 2,
    }
    window.FileReader = jest.fn(() => mockFileReaderInstance)

    // The actual input is hidden, but we can find it
    const fileInput = document.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [file] } })
    mockFileReaderInstance.onload()

    expect(storage.saveLogo).toHaveBeenCalledWith('data:image/png;base64,test')
  })

  test('handles loading example data', async () => {
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    fireEvent.click(await screen.findByText('More'))
    fireEvent.click(await screen.findByText('load_example_data'))

    expect(await screen.findByDisplayValue('Dragon Corp')).toBeInTheDocument()
  })

  test('handles clearing saved data', async () => {
    storage.loadCompanyInfo.mockReturnValue({ businessName: 'Saved Biz' })
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    expect(await screen.findByDisplayValue('Saved Biz')).toBeInTheDocument()

    fireEvent.click(await screen.findByText('More'))
    fireEvent.click(await screen.findByText('clear_saved_data'))

    // Confirm in dialog
    fireEvent.click(await screen.findByText('Clear'))

    expect(storage.clearCompanyInfo).toHaveBeenCalled()
    // Check that specific input is empty
    const bizInput = document.querySelector('input[name="businessName"]')
    expect(bizInput.value).toBe('')
  })

  test('toggles preview', async () => {
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    // Wait for form to appear
    await screen.findByText('bill_to')

    // Fill required fields for validation using specific selectors
    const bizInput = document.querySelector('input[name="businessName"]')
    fireEvent.change(bizInput, { target: { value: 'Biz', name: 'businessName' } })

    const clientInput = document.querySelector('input[name="clientName"]')
    fireEvent.change(clientInput, { target: { value: 'Client', name: 'clientName' } })

    // Add line item details to pass validation
    const itemDesc = screen.getByLabelText('description')
    fireEvent.change(itemDesc, { target: { value: 'Item 1', name: 'description' } })

    const itemRate = screen.getByLabelText('rate')
    fireEvent.change(itemRate, { target: { value: '100', name: 'rate' } })

    const previewBtn = await screen.findByText('preview_invoice')
    fireEvent.click(previewBtn)

    // The toast might not show up in tests, but we can check if the preview component is rendered
    // When showPreview is true, the button text changes to back_to_edit
    await waitFor(
      () => {
        expect(screen.getByText('back_to_edit')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  test('loads example data', async () => {
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    fireEvent.click(await screen.findByText('More'))
    fireEvent.click(await screen.findByText('load_example_data'))

    // Check if some example data is populated
    const bizInput = document.querySelector('input[name="businessName"]')
    expect(bizInput.value).not.toBe('')
  })

  test('toggles receipt mode', async () => {
    render(<Templates />)
    const radio = document.querySelector('input[value="template1"]')
    fireEvent.click(radio)

    fireEvent.click(await screen.findByText('More'))

    // Use a more flexible text matcher for potentially broken up text
    const receiptToggle = await screen.findByText((content, element) => {
      return element.textContent.includes('receipt_mode')
    })
    fireEvent.click(receiptToggle)

    // Receipt mode adds PAID stamp in Preview or changes UI text
    expect(await screen.findByText(/back_to_invoice/i)).toBeInTheDocument()
  })
})
