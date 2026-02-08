import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form from '../Form'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }) => <img {...props} src={src} alt={alt || ''} />
  MockImage.displayName = 'MockImage'
  return {
    __esModule: true,
    default: MockImage,
  }
})

// Mock Table
jest.mock('../../Table/Table', () => {
  const Table = () => <div data-testid="table" />
  Table.displayName = 'Table'
  return Table
})

describe('Form Component', () => {
  const mockProps = {
    logo: null,
    updateLogo: jest.fn(),
    logoUpdated: false,
    prefill: { formType: 'invoice' },
    currencySymbol: '$',
    rows: [],
    onFormMod: jest.fn(),
    onTableUpdate: jest.fn(),
    onRowAdd: jest.fn(),
    onRowRemove: jest.fn(),
    onRemoveLogo: jest.fn(),
    clients: [{ id: 'c1', name: 'Client A', email: 'a@test.com' }],
  }

  test('calls onFormMod when input changes', () => {
    render(<Form {...mockProps} />)
    // Use container to find specific input by name since labels are duplicated
    const bizInput = document.querySelector('input[name="businessName"]')
    fireEvent.change(bizInput, { target: { value: 'New Biz', name: 'businessName' } })
    expect(mockProps.onFormMod).toHaveBeenCalledWith('businessName', 'New Biz')
  })

  test('switches form type', () => {
    render(<Form {...mockProps} />)
    const receiptBtn = screen.getByText('receipt')
    fireEvent.click(receiptBtn)
    expect(mockProps.onFormMod).toHaveBeenCalledWith('formType', 'receipt')
  })

  test('handles client selection', () => {
    render(<Form {...mockProps} />)
    const selector = screen.getByLabelText('Select existing client')
    fireEvent.change(selector, { target: { value: 'c1' } })

    expect(mockProps.onFormMod).toHaveBeenCalledWith('clientName', 'Client A')
    expect(mockProps.onFormMod).toHaveBeenCalledWith('clientEmail', 'a@test.com')
  })

  test('calls onRemoveLogo when remove button clicked', () => {
    const propsWithLogo = { ...mockProps, logo: 'test-logo', logoUpdated: true }
    render(<Form {...propsWithLogo} />)
    const removeBtn = screen.getByLabelText('logo')
    fireEvent.click(removeBtn)
    expect(mockProps.onRemoveLogo).toHaveBeenCalled()
  })
})
