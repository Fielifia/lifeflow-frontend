import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../../features/auth/pages/LoginPage'
import * as authApi from '../../shared/api/authApi'

jest.mock('../../shared/api/authApi')

describe('Login', () => {
  test('calls setUser on successful login', async () => {
    const mockSetUser = jest.fn()

    authApi.login.mockResolvedValue({
      username: 'Sofia',
    })

    render(<Login setUser={mockSetUser} />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled()
    })
  })
})

test('shows error on failed login', async () => {
  authApi.login.mockRejectedValue({
    response: { data: { error: 'Invalid credentials' } },
  })

  render(<Login setUser={jest.fn()} />)

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@test.com' },
  })

  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'wrong' },
  })

  fireEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})
