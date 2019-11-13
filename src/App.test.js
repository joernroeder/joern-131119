import React from 'react'
import { render, fireEvent, act } from 'test-utils'

import App from './App'

test('renders without crashing', async () => {
  await act(async () => {
    const { queryByText, container } = render(<App />)

    //expect(queryByText('Testing')).toBeInTheDocument()
    //expect(container).toMatchSnapshot()
  })
})
