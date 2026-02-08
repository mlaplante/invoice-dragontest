import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ConfirmDialog from '../ConfirmDialog'

// Mock next-translate
jest.mock('next-translate/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key) => key,
  }),
}))

describe('ConfirmDialog Component', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog isOpen={false} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('renders with title and message', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  test('calls onConfirm when confirm button clicked', () => {
    render(<ConfirmDialog isOpen={true} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)
    fireEvent.click(screen.getByText('Confirm'))
    expect(mockOnConfirm).toHaveBeenCalled()
  })

  test('calls onCancel when cancel button clicked', () => {
    render(<ConfirmDialog isOpen={true} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  test('calls onCancel when overlay clicked', () => {
    const { container } = render(
      <ConfirmDialog isOpen={true} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
    )
    fireEvent.click(container.firstChild)
    expect(mockOnCancel).toHaveBeenCalled()
  })
})
