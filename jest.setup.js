import '@testing-library/jest-dom'

// Mock window.scroll
window.scroll = jest.fn()
window.scrollTo = jest.fn()
