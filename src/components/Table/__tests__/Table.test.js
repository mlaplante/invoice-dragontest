import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Table from '../Table'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('Table Component', () => {
  const mockProps = {
    rows: [{ id: 0, description: 'Item 1', rate: 100, quantity: 2, amount: '200.00' }],
    currencySymbol: '$',
    onModifyTable: jest.fn(),
    onAddInvoiceRow: jest.fn(),
    onRemoveInvoiceRow: jest.fn(),
  }

  test('renders rows correctly', () => {
    render(<Table {...mockProps} />)
    expect(screen.getByDisplayValue('Item 1')).toBeInTheDocument()
    expect(screen.getByText('200.00')).toBeInTheDocument()
  })

  test('calls onAddInvoiceRow when add button clicked', () => {
    render(<Table {...mockProps} />)
    const addBtn = screen.getByText('add_item')
    fireEvent.click(addBtn)
    expect(mockProps.onAddInvoiceRow).toHaveBeenCalled()
  })

  test('calls onRemoveInvoiceRow when remove button clicked', () => {
    render(<Table {...mockProps} />)
    const removeBtn = screen.getByLabelText(/remove_item/i)
    fireEvent.click(removeBtn)
    expect(mockProps.onRemoveInvoiceRow).toHaveBeenCalledWith(0)
  })

  test('calls onModifyTable when description changes', () => {
    render(<Table {...mockProps} />)
    const descInput = screen.getByLabelText('description')
    fireEvent.change(descInput, { target: { value: 'New Desc', name: 'description' } })
    expect(mockProps.onModifyTable).toHaveBeenCalled()
  })

  test('calls onModifyTable when rate changes', () => {
    render(<Table {...mockProps} />)
    const rateInput = screen.getByLabelText('rate')
    fireEvent.change(rateInput, { target: { value: '150', name: 'rate' } })
    expect(mockProps.onModifyTable).toHaveBeenCalled()
  })

  test('renders empty state message when no rows', () => {
    render(<Table {...mockProps} rows={[]} />)
    expect(screen.getByText('empty_state_no_line_items')).toBeInTheDocument()
  })
})
