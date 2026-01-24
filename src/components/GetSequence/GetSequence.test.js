import { act, screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event'

import GetSequence from "./GetSequence"
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { mockUseVolcaStore } from '../../../test/mockUseVolcaStore'
jest.unmock('zustand')

const webMidiContext = {
  midiInitialised: false,
}

const storeState = {
  currentSequenceNumber: 10,
}

const loadSequenceNumber = jest.fn()
const saveSequenceNumber = jest.fn()
const loadCurrentSequence = jest.fn()
const deviceInquiry = jest.fn()

const renderWithContext = () => {
  jest.clearAllMocks();
  mockUseVolcaStore(storeState);
  const contextValue = {
    loadSequenceNumber,
    saveSequenceNumber,
    loadCurrentSequence,
    deviceInquiry,
    webMidiContext,
  }

  return render(
    <VolcaFMContext.Provider value={contextValue}>
      <GetSequence />
    </VolcaFMContext.Provider>
  )
}

describe('GetSequence', () => {
  test('Renders the empty GetSequence block if Midi is not initialised', async () => {
    await act(async () => {
      renderWithContext()
    })
    expect(screen.queryByText('Sequence Number')).not.toBeInTheDocument()
  })

  describe('when midi is initialised', () => {
    test('Renders the Controls', async () => {
      webMidiContext.midiInitialised = true

      await act(async () => {
        renderWithContext()
      })
      expect(screen.getByLabelText('Sequence Number')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Load' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Load Current' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save current to...' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Check Device' })).toBeInTheDocument()
    })


    test('Loads the chosen sequence when I click the button', async () => {
      webMidiContext.midiInitialised = true

      const user = userEvent.setup()

      await act(async () => {
        renderWithContext()
      })

      const number = screen.getByLabelText('Sequence Number')
      const load = screen.getByRole('button', { name: 'Load' })
      await user.clear(number)
      await user.type(number, '15')
      await user.click(load)

      expect(loadSequenceNumber).toHaveBeenCalledWith(15)
    })

    test('calls Load current sequence when I click the button', async () => {
      webMidiContext.midiInitialised = true
      const user = userEvent.setup()

      await act(async () => {
        renderWithContext()
      })

      const load = screen.getByRole('button', { name: 'Load Current' })
      await user.click(load)

      expect(loadCurrentSequence).toHaveBeenCalled()
    })
  })
})