import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Sequence from './Sequence'
import VolcaFMContext from '../../contexts/VolcaFMContext'

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
    const contextValue = {
      currentSequence: { steps: [], motionData: {} },
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: false }
    }
    const { container } = renderWithContext(contextValue)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders sequence steps when sequence is loaded', () => {
    const contextValue = {
      currentSequence: { steps: [{}, {}, {}], motionData: {} },
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext(contextValue)
    expect(screen.getByText('Current Sequence 1')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  test('renders motion data correctly', () => {
    const contextValue = {
      currentSequence: { steps: [{}], motionData: { param: 'value' } },
      currentSequenceNumber: 1,
      webMidiContext: { midiInitialised: true }
    }
    renderWithContext(contextValue)
    
    expect(screen.getByText('Motion data: {"param":"value"}')).toBeInTheDocument()
  })
})