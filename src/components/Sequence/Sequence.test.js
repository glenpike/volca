import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Sequence from './Sequence'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { unpackedData } from '../../../test/sequenceBytes'
import { parseSequenceBytes } from '../../utils/Volca/parseSequence'
import { mockUseVolcaStore } from '../../../test/mockUseVolcaStore'
jest.unmock('zustand')

jest.mock('../Step/Step', () => () => <div className="step">Mock Step</div>);

const defaultStoreState = {
  currentSequenceNumber: null,
  sequences: [],
}

const renderWithContext = ({ contextValue, storeState = defaultStoreState }) => {
  jest.clearAllMocks();
  mockUseVolcaStore(storeState);

  return render(
    <VolcaFMContext.Provider value={contextValue}>
      <Sequence />
    </VolcaFMContext.Provider>
  )
}

describe('Sequence Component', () => {
  test('renders "Load a sequence" when no sequence is loaded', () => {
    const contextValue = {
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext({ contextValue })
    expect(screen.getByText('Load a sequence')).toBeInTheDocument()
  })

  test('renders null when MIDI is not initialised', () => {
    const contextValue = {
      webMidiContext: { midiInitialised: false }
    }

    const { container } = renderWithContext({ contextValue })
    expect(container).toBeEmptyDOMElement()
  })

  test('renders sequence steps when sequence is loaded', () => {
    const sequence = parseSequenceBytes([...unpackedData])
    const contextValue = {
      webMidiContext: { midiInitialised: true }
    }
    const storeState = {
      currentSequenceNumber: 0,
      sequences: [sequence],
    }
    renderWithContext({ contextValue, storeState })
    expect(screen.getByText('Sequence 1')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(16)
  })

  test('renders motion data correctly', () => {
    const sequence = parseSequenceBytes([...unpackedData])
    const contextValue = {
      webMidiContext: { midiInitialised: true }
    }
    const storeState = {
      currentSequenceNumber: 0,
      sequences: [sequence],
    }
    renderWithContext({ contextValue, storeState })

    expect(screen.getByText(/Motion data:/)).toBeInTheDocument()
  })
})