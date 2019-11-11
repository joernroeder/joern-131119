import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import App from './App'

test('renders without crashing', () => {
  const { queryByText, container } = render(<App />)

  //expect(queryByText('Testing')).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
