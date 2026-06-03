import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ConfirmProvider } from '../../shared/context/ConfirmContext'
import { UserProvider } from '../../shared/context/UserContext'

import Login from '../../features/auth/pages/LoginPage'

import * as authApi from '../../shared/api/authApi'

jest.mock('../../shared/api/authApi')

describe('Login', () => {
  test('calls login on successful login', async () => {
    authApi.login.mockResolvedValue({
      username: 'Sofia',
    })

    render(
      <UserProvider>
        <ConfirmProvider>
          <Login />
        </ConfirmProvider>
      </UserProvider>
    )

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled()
    })
  })

  test('shows error on failed login', async () => {
    authApi.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    })

    render(
      <UserProvider>
        <ConfirmProvider>
          <Login />
        </ConfirmProvider>
      </UserProvider>
    )

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrong' },
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/invalid credentials/i)
      ).toBeInTheDocument()
    })
  })
})
