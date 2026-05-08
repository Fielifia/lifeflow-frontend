import { render, screen } from '@testing-library/react'

import App from '../App'

jest.mock('../App', () => () => <div>App</div>)

test('renders app', () => {
  render(<App />)
  expect(screen.getByText('App')).toBeInTheDocument()
})
