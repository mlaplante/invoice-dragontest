import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dropdown from '../Dropdown/Dropdown'

describe('Dropdown Component', () => {
  const mockOnCurrencyModify = jest.fn()

  test('renders current currency', () => {
    render(
      <Dropdown currencyCode="USD" currencySymbol="$" onCurrencyModify={mockOnCurrencyModify} />
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  test('opens dropdown and selects a currency', () => {
    render(
      <Dropdown currencyCode="USD" currencySymbol="$" onCurrencyModify={mockOnCurrencyModify} />
    )
    fireEvent.click(screen.getByRole('button'))

    // Find EUR option from the hardcoded currencies.json
    const eurOption = screen.getAllByRole('option').find((el) => el.textContent.includes('EUR'))
    fireEvent.click(eurOption)

    expect(mockOnCurrencyModify).toHaveBeenCalledWith(expect.objectContaining({ code: 'EUR' }))
  })

  test('handles keyboard navigation', () => {
    render(
      <Dropdown currencyCode="USD" currencySymbol="$" onCurrencyModify={mockOnCurrencyModify} />
    )
    const container = screen.getByRole('listbox')
    fireEvent.keyDown(container, { key: 'ArrowDown' })
    fireEvent.keyDown(container, { key: 'Enter' })

    // Since it's hardcoded, AED is usually first
    expect(mockOnCurrencyModify).toHaveBeenCalled()
  })

  test('handles Escape and Tab keys', () => {
    render(
      <Dropdown currencyCode="USD" currencySymbol="$" onCurrencyModify={mockOnCurrencyModify} />
    )
    const container = screen.getByRole('listbox')
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('option')[0]).toBeInTheDocument()

    fireEvent.keyDown(container, { key: 'Escape' })
    expect(screen.queryByRole('option')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))
    fireEvent.keyDown(container, { key: 'Tab' })
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  test('handles ArrowUp navigation', () => {
    render(
      <Dropdown currencyCode="USD" currencySymbol="$" onCurrencyModify={mockOnCurrencyModify} />
    )
    const container = screen.getByRole('listbox')
    fireEvent.keyDown(container, { key: 'ArrowUp' })
    fireEvent.keyDown(container, { key: 'Enter' })
    expect(mockOnCurrencyModify).toHaveBeenCalled()
  })
})
