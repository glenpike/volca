import { render, screen, act, } from '@testing-library/react';
import { mockUseVolcaStore } from '../test/mockUseVolcaStore'

import App from './App';

const storeState = { 
  currentSequenceNumber: 10,
}

jest.mock('webmidi', () => {
  const input = {
    id: '1',
    manufacturer: 'Ben',
    name: 'Widi Input 1'
  }

  const output = {
    id: '1',
    manufacturer: 'Ben',
    name: 'Widi Output 1'
  }

  const inputs = [input]
  const outputs = [output]

  const enable = (options) => {
    console.log('fakenable')
    return Promise.resolve(options)
  }

  const actual = jest.requireActual('webmidi')
  const { WebMidi: wm } = actual

  return {
    ...actual,
    WebMidi: {
      ...wm,
      enable,
      inputs,
      outputs,
    },
  }
})

describe('App', () => {
  test('renders ok', async () => {
    jest.clearAllMocks();
    mockUseVolcaStore(storeState);

    await act(async () => {
      render(<App />)
    })

    const title = screen.getByText(/Korg Volca FM2 Sequences/i)
    expect(title).toBeInTheDocument()
  })
})
