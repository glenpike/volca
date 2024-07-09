import { render as rtlRender } from '@testing-library/react';

export * from '@testing-library/react'
export {customRender as render}

import WebMidiContext, { WebMidiContextProvider } from '../contexts/WebMidiContext'
import { VolcaFMContextProvider } from '../contexts/VolcaFMContext'

const KORG_MANUFACTURER_ID = 0x42
const MIDI_CHANNEL = 3

export const customRender = (
  ui,
  options,
) => {
  const Wrapper = ({ children }) => {
      const { WebMidi } = options
      return (
        <>
        <WebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID} WebMidi={WebMidi}>
          <WebMidiContext.Consumer>
            {midiContext => (
              <VolcaFMContextProvider channel={MIDI_CHANNEL} injectedMidiContext={midiContext}>
                {children}
              </VolcaFMContextProvider>
            )}
          </WebMidiContext.Consumer>
        </WebMidiContextProvider>
      </>
      )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}