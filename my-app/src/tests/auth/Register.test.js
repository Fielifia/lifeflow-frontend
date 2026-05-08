import { render, screen, fireEvent } from '@testing-library/react'
import Register from '../../features/auth/pages/RegisterPage'

describe('Register', () => {
  test('shows error if passwords do not match', () => {
    render(<Register setUser={jest.fn()} />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'sofia' },
    })

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: '123' },
    })

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: '456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })
})
