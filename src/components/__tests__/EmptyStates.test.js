import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form from '../Form/Form'
import Table from '../Table/Table'
import TipBanner from '../TipBanner/TipBanner'

// Mock next-translate
jest.mock('next-translate', () => ({
  useTranslation: jest.fn(() => ({
    t: (key) => {
      const translations = {
        placeholder_business_name: 'e.g., Acme Inc.',
        placeholder_business_email: 'e.g., info@example.com',
        placeholder_street: 'e.g., 123 Main Street',
        placeholder_city: 'e.g., San Francisco',
        placeholder_zipcode: 'e.g., 94107',
        placeholder_phone: 'e.g., (555) 123-4567',
        placeholder_website: 'e.g., www.example.com',
        placeholder_client_name: 'e.g., John Smith',
        placeholder_client_email: 'e.g., client@example.com',
        placeholder_client_address: 'e.g., 456 Oak Avenue',
        placeholder_client_city: 'e.g., New York',
        placeholder_client_zipcode: 'e.g., 10001',
        placeholder_client_phone: 'e.g., (555) 987-6543',
        placeholder_invoice_no: 'e.g., INV-001',
        placeholder_invoice_date: 'Select a date',
        placeholder_line_item_description: 'e.g., Web Development Services',
        placeholder_line_item_rate: 'e.g., 100.00',
        empty_state_no_line_items: "No line items yet. Click 'Add Item' to get started.",
        tip_1: 'Pro tip: Add your company logo for professional invoices',
        tip_2: 'Pro tip: Your company information is saved automatically',
        tip_3: 'Pro tip: Try different templates to find your favorite look',
        tip_4: 'Pro tip: Line items calculate totals automatically',
        tip_5: 'Pro tip: Download invoices as PDF files for sharing',
        add_item: 'Add Item',
        from: 'From',
        name: 'Name',
        email: 'Email',
        address: 'Address',
        phone: 'Phone',
        website: 'Website',
        bill_to: 'Bill To',
        invoice_details: 'Invoice Details',
        invoice_no: 'Invoice No',
        due_date: 'Due Date',
        description: 'Description',
        rate: 'Rate',
        qty: 'Qty',
        amount: 'Amount',
        item: 'Item',
        item_description: 'Item Description',
        additional_details: 'Additional details',
        notes: 'Notes',
        invoice: 'Invoice',
        business_name_placeholder: 'Business Name',
        business_email_placeholder: 'name@business.com',
        client_email_placeholder: 'client@business.com',
        street_placeholder: 'street',
        city_state_country_placeholder: 'city, state, country',
        postal_code_placeholder: 'postal code',
        phone_placeholder: '(123) 456 789',
        website_placeholder: 'https://example-website.com',
        add_logo: 'Add your logo',
        update_logo: 'Update logo',
        notes_comment: 'Notes - any relevant information not covered',
        total: 'Total',
      }
      return translations[key] || key
    },
    lang: 'en',
  })),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img {...props} src={src} alt={alt || ''} />,
}))

describe('Form Component - Placeholders', () => {
  const mockProps = {
    logo: null,
    updateLogo: jest.fn(),
    logoUpdated: false,
    prefill: {},
    currencySymbol: '$',
    rows: [{ id: 0, quantity: 1, amount: '0.00' }],
    onFormMod: jest.fn(),
    onTableUpdate: jest.fn(),
    onRowAdd: jest.fn(),
    onRowRemove: jest.fn(),
    onRemoveLogo: jest.fn(),
  }

  test('renders business name input with placeholder', () => {
    render(<Form {...mockProps} />)
    const businessNameInput = screen.getByPlaceholderText('placeholder_business_name')
    expect(businessNameInput).toBeInTheDocument()
  })

  test('renders business email input with placeholder', () => {
    render(<Form {...mockProps} />)
    const emailInput = screen.getByPlaceholderText('placeholder_business_email')
    expect(emailInput).toBeInTheDocument()
  })

  test('renders business address input with placeholder', () => {
    render(<Form {...mockProps} />)
    const addressInput = screen.getByPlaceholderText('placeholder_street')
    expect(addressInput).toBeInTheDocument()
  })

  test('renders business city input with placeholder', () => {
    render(<Form {...mockProps} />)
    const cityInput = screen.getByPlaceholderText('placeholder_city')
    expect(cityInput).toBeInTheDocument()
  })

  test('renders business zipcode input with placeholder', () => {
    render(<Form {...mockProps} />)
    const zipcodeInput = screen.getByPlaceholderText('placeholder_zipcode')
    expect(zipcodeInput).toBeInTheDocument()
  })

  test('renders business phone input with placeholder', () => {
    render(<Form {...mockProps} />)
    const phoneInputs = screen.getAllByPlaceholderText('placeholder_phone')
    expect(phoneInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders business website input with placeholder', () => {
    render(<Form {...mockProps} />)
    const websiteInput = screen.getByPlaceholderText('placeholder_website')
    expect(websiteInput).toBeInTheDocument()
  })

  test('renders client name input with placeholder', () => {
    render(<Form {...mockProps} />)
    const clientNameInput = screen.getByPlaceholderText('placeholder_client_name')
    expect(clientNameInput).toBeInTheDocument()
  })

  test('renders client email input with placeholder', () => {
    render(<Form {...mockProps} />)
    const clientEmailInputs = screen.getAllByPlaceholderText('placeholder_client_email')
    expect(clientEmailInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders client address input with placeholder', () => {
    render(<Form {...mockProps} />)
    const addressInputs = screen.getAllByPlaceholderText('placeholder_client_address')
    expect(addressInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders client city input with placeholder', () => {
    render(<Form {...mockProps} />)
    const cityInputs = screen.getAllByPlaceholderText('placeholder_client_city')
    expect(cityInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders client zipcode input with placeholder', () => {
    render(<Form {...mockProps} />)
    const zipcodeInputs = screen.getAllByPlaceholderText('placeholder_client_zipcode')
    expect(zipcodeInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders client phone input with placeholder', () => {
    render(<Form {...mockProps} />)
    const clientPhoneInputs = screen.getAllByPlaceholderText('placeholder_client_phone')
    expect(clientPhoneInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('renders invoice number input with placeholder', () => {
    render(<Form {...mockProps} />)
    const invoiceInput = screen.getByPlaceholderText('placeholder_invoice_no')
    expect(invoiceInput).toBeInTheDocument()
  })
})

describe('TipBanner Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('renders tip banner with a tip message', () => {
    render(<TipBanner />)
    const banner = screen.getByRole('region')
    expect(banner).toBeInTheDocument()
  })

  test('displays one of the five tips', () => {
    render(<TipBanner />)
    const tips = [
      'Pro tip: Add your company logo for professional invoices',
      'Pro tip: Your company information is saved automatically',
      'Pro tip: Try different templates to find your favorite look',
      'Pro tip: Line items calculate totals automatically',
      'Pro tip: Download invoices as PDF files for sharing',
    ]

    let tipFound = false
    tips.forEach((tip) => {
      if (screen.queryByText(tip)) {
        tipFound = true
      }
    })
    expect(tipFound).toBe(true)
  })

  test('renders close button with accessible label', () => {
    render(<TipBanner />)
    const closeButton = screen.getByRole('button', { name: /dismiss/i })
    expect(closeButton).toBeInTheDocument()
  })

  test('can be dismissed with close button', () => {
    const { container } = render(<TipBanner />)
    const closeButton = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(closeButton)
    const banner = container.querySelector('[role="region"]')
    expect(banner).not.toBeInTheDocument()
  })

  test('persists dismissed state in localStorage', () => {
    const { rerender } = render(<TipBanner />)
    const closeButton = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(closeButton)

    const isDismissed = localStorage.getItem('invoiceDragonTipBannerDismissed')
    expect(isDismissed).toBe('true')
  })

  test('stays dismissed after rerender when localStorage has dismissal', () => {
    localStorage.setItem('invoiceDragonTipBannerDismissed', 'true')
    const { container } = render(<TipBanner />)
    const banner = container.querySelector('[role="region"]')
    expect(banner).not.toBeInTheDocument()
  })

  test('has smooth fade-in animation class on appear', () => {
    render(<TipBanner />)
    const banner = screen.getByRole('region')
    expect(banner).toHaveClass('fadeIn')
  })
})

describe('Table Component - Empty State', () => {
  const mockProps = {
    rows: [],
    currencySymbol: '$',
    onModifyTable: jest.fn(),
    onAddInvoiceRow: jest.fn(),
    onRemoveInvoiceRow: jest.fn(),
  }

  test('shows empty state message when no line items', () => {
    render(<Table {...mockProps} />)
    const emptyMessage = screen.getByText('empty_state_no_line_items')
    expect(emptyMessage).toBeInTheDocument()
  })

  test('hides empty state message when items exist', () => {
    const propsWithItems = {
      ...mockProps,
      rows: [{ id: 0, description: 'Test', quantity: 1, rate: 100, amount: '100.00' }],
    }
    const { container } = render(<Table {...propsWithItems} />)
    const emptyMessage = container.querySelector('[class*="empty"]')
    expect(emptyMessage).not.toBeInTheDocument()
  })

  test('displays "Add Item" button with icon', () => {
    const { container } = render(<Table {...mockProps} />)
    const addButton = container.querySelector('.btn__add')
    expect(addButton).toBeInTheDocument()
  })

  test('calls onAddInvoiceRow when Add Item button clicked', () => {
    const onAddMock = jest.fn()
    const props = { ...mockProps, onAddInvoiceRow: onAddMock }
    const { container } = render(<Table {...props} />)
    const addButton = container.querySelector('.btn__add')
    fireEvent.click(addButton)
    expect(onAddMock).toHaveBeenCalled()
  })
})

describe('Empty States Integration', () => {
  test('form has placeholder text for all input fields', () => {
    const mockProps = {
      logo: null,
      updateLogo: jest.fn(),
      logoUpdated: false,
      prefill: {},
      currencySymbol: '$',
      rows: [{ id: 0, quantity: 1, amount: '0.00' }],
      onFormMod: jest.fn(),
      onTableUpdate: jest.fn(),
      onRowAdd: jest.fn(),
      onRowRemove: jest.fn(),
      onRemoveLogo: jest.fn(),
    }

    const { container } = render(<Form {...mockProps} />)
    const inputs = container.querySelectorAll('input[placeholder]')
    expect(inputs.length).toBeGreaterThan(10)
  })

  test('tip banner and form can coexist without conflicts', () => {
    const mockFormProps = {
      logo: null,
      updateLogo: jest.fn(),
      logoUpdated: false,
      prefill: {},
      currencySymbol: '$',
      rows: [{ id: 0, quantity: 1, amount: '0.00' }],
      onFormMod: jest.fn(),
      onTableUpdate: jest.fn(),
      onRowAdd: jest.fn(),
      onRowRemove: jest.fn(),
      onRemoveLogo: jest.fn(),
    }

    const { container } = render(
      <>
        <TipBanner />
        <Form {...mockFormProps} />
      </>
    )

    const banner = container.querySelector('[role="region"]')
    const form = container.querySelector('form')
    expect(banner).toBeInTheDocument()
    expect(form).toBeInTheDocument()
  })

  test('all placeholders are non-empty strings', () => {
    const mockProps = {
      logo: null,
      updateLogo: jest.fn(),
      logoUpdated: false,
      prefill: {},
      currencySymbol: '$',
      rows: [{ id: 0, quantity: 1, amount: '0.00' }],
      onFormMod: jest.fn(),
      onTableUpdate: jest.fn(),
      onRowAdd: jest.fn(),
      onRowRemove: jest.fn(),
      onRemoveLogo: jest.fn(),
    }

    const { container } = render(<Form {...mockProps} />)
    const inputs = container.querySelectorAll('input[placeholder]')
    inputs.forEach((input) => {
      expect(input.placeholder).toBeTruthy()
      expect(input.placeholder.length).toBeGreaterThan(0)
    })
  })
})
