import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify({ username: 'Sofia' }))
})

test('renders dashboard content when logged in', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByText(/weekly activity/i)).toBeInTheDocument()
})
