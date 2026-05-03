import { render, screen } from '@testing-library/react'

jest.mock('./App', () => () => <div>App</div>)

import App from './App'

test('renders app', () => {
  render(<App />)
  expect(screen.getByText('App')).toBeInTheDocument()
})
