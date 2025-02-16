import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Sequence from './Sequence'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import VolcaSequence from '../../utils/Volca/Sequence'
import { unpackedData } from '../../../test/sequenceBytes'

jest.mock('../Step/Step.js', () => () => <div className="step">Mock Step</div>);

const renderWithContext = (contextValue) => {
  return render(
    <VolcaFMContext.Provider value={contextValue}>
      <Sequence />
    </VolcaFMContext.Provider>
  )
}

describe('Sequence Component', () => {
  test('renders "Load a sequence" when no sequence is loaded', () => {
    const contextValue = {
      currentSequence: null,
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext(contextValue)
    expect(screen.getByText('Load a sequence')).toBeInTheDocument()
  })

  test('renders null when MIDI is not initialised', () => {
    const sequence = new VolcaSequence(1)
    sequence.fromBytes([...unpackedData])
    const contextValue = {
      currentSequence: sequence,
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: false }
    }
    const { container } = renderWithContext(contextValue)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders sequence steps when sequence is loaded', () => {
    const sequence = new VolcaSequence(1)
    sequence.fromBytes([...unpackedData])
    const contextValue = {
      currentSequence: sequence,
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext(contextValue)
    expect(screen.getByText('Current Sequence 1')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(16)
  })

  test('renders motion data correctly', () => {
    const sequence = new VolcaSequence(1)
    sequence.fromBytes([...unpackedData])
    const contextValue = {
      currentSequence: sequence,
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext(contextValue)
    
    expect(screen.getByText(/Motion data:/)).toBeInTheDocument()
  })
})