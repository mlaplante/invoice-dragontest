import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Toast from '../Toast'

describe('Toast Component', () => {
  test('renders message', () => {
    render(<Toast message="Test Message" onClose={() => {}} />)
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  test('applies visible class', () => {
    const { container } = render(<Toast message="Test" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('visible')
  })

  test('renders different types', () => {
    const { rerender, container } = render(
      <Toast message="Success" type="success" onClose={() => {}} />
    )
    expect(container.firstChild).toHaveClass('success')

    rerender(<Toast message="Error" type="error" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('error')

    rerender(<Toast message="Loading" type="loading" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('loading')
  })

  test('calls onClose after timeout', () => {
    jest.useFakeTimers()
    const mockOnClose = jest.fn()
    render(<Toast message="Test" onClose={mockOnClose} duration={3000} />)

    act(() => {
      jest.advanceTimersByTime(3500) // Give it a little extra time
    })

    expect(mockOnClose).toHaveBeenCalled()
    jest.useRealTimers()
  })
})
