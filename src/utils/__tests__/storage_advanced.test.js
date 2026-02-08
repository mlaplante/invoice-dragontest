import * as storage from '../storage'

describe('storage utility - advanced features', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test('saveInvoice and loadInvoices', () => {
    const invoice = { id: 'inv_1', formData: { clientName: 'Test' }, rows: [] }
    storage.saveInvoice(invoice)

    const invoices = storage.loadInvoices()
    expect(invoices).toHaveLength(1)
    expect(invoices[0].id).toBe('inv_1')
  })

  test('updates existing invoice', () => {
    const invoice = { id: 'inv_1', formData: { clientName: 'Test' } }
    storage.saveInvoice(invoice)

    const updated = { id: 'inv_1', formData: { clientName: 'Updated' } }
    storage.saveInvoice(updated)

    const invoices = storage.loadInvoices()
    expect(invoices).toHaveLength(1)
    expect(invoices[0].formData.clientName).toBe('Updated')
  })

  test('deleteInvoice', () => {
    storage.saveInvoice({ id: 'inv_1' })
    storage.saveInvoice({ id: 'inv_2' })

    storage.deleteInvoice('inv_1')
    const invoices = storage.loadInvoices()
    expect(invoices).toHaveLength(1)
    expect(invoices[0].id).toBe('inv_2')
  })

  test('saveClient and loadClients', () => {
    const client = { name: 'Client A', email: 'a@test.com' }
    storage.saveClient(client)

    const clients = storage.loadClients()
    expect(clients).toHaveLength(1)
    expect(clients[0].name).toBe('Client A')
  })

  test('updates client by name (case-insensitive)', () => {
    storage.saveClient({ name: 'Client A', email: 'old@test.com' })
    storage.saveClient({ name: 'client a', email: 'new@test.com' })

    const clients = storage.loadClients()
    expect(clients).toHaveLength(1)
    expect(clients[0].email).toBe('new@test.com')
  })

  test('saveLogo and loadLogo', () => {
    const logoData = 'data:image/png;base64,test'
    storage.saveLogo(logoData)
    expect(storage.loadLogo()).toBe(logoData)
  })

  test('clearLogo', () => {
    storage.saveLogo('test')
    storage.clearLogo()
    expect(storage.loadLogo()).toBeNull()
  })
})
