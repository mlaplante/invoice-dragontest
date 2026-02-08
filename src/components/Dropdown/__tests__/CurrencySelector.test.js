import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CurrencySelector from '../CurrencySelector'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('CurrencySelector Component', () => {
  const mockProps = {
    currencyCode: 'USD',
    currencySymbol: '$',
    onCurrencyModify: jest.fn(),
  }

  test('renders current currency', () => {
    render(<CurrencySelector {...mockProps} />)
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  test('opens dropdown on click', () => {
    const { container } = render(<CurrencySelector {...mockProps} />)
    fireEvent.click(screen.getByText('USD'))

    // Find AED in the dropdown content
    const dropdown = container.querySelector('.dropdown__content')
    expect(dropdown.textContent).toContain('AED')
  })

  test('selects currency and calls onCurrencyModify', () => {
    render(<CurrencySelector {...mockProps} />)
    fireEvent.click(screen.getByText('USD'))

    // Target the first EUR option's code span
    const eurOption = screen.getAllByText('EUR')[0]
    fireEvent.click(eurOption)
    expect(mockProps.onCurrencyModify).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'EUR' })
    )
  })

  test('closes on click outside', () => {
    render(<CurrencySelector {...mockProps} />)
    fireEvent.click(screen.getByText('USD'))

    const eurOption = screen.getAllByText('EUR')[0]
    expect(eurOption).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('EUR')).not.toBeInTheDocument()
  })
})
