import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event'

import GetSequence from "./GetSequence"
import { volcaRender } from '../../utils/test-utils';

//We can't quite mock the VolcaFMContext, which would be nicer perhaps?
const webMidiContext = {
  midiInitialised: false,
  sendSysexMessage: jest.fn(),
  lastRxSysexMessage: ''
}

describe('GetSequence', () => {
  test('Renders the empty GetSequence block if Midi is not initialised', async () => {
    await act(async () => {
      volcaRender(<GetSequence/>, { midiContext: webMidiContext })
    })
    expect(screen.queryByText('Sequence Number')).not.toBeInTheDocument()
  })

  describe('when midi is initialised', () => {
    test('Renders the Controls', async () => {
      webMidiContext.midiInitialised = true
      
      await act(async () => {
        volcaRender(<GetSequence/>, { midiContext: webMidiContext })
      })
      expect(screen.getByLabelText('Sequence Number')).toBeInTheDocument()
      expect(screen.getByRole('button', {text: 'Load'})).toBeInTheDocument()
    })


    test('Sets the chosen sequence when I click the button', async () => {
      const user = userEvent.setup()

      await act(async () => {
        volcaRender(<GetSequence/>, { midiContext: webMidiContext })
      })
      

      const number = screen.getByLabelText('Sequence Number')
      const load = screen.getByRole('button', {text: 'Load'})
      await user.type(number, '15')
      await user.click(load)

      expect(webMidiContext.sendSysexMessage).toHaveBeenCalled()
    })
  })
})