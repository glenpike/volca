import { render as rtlRender } from '@testing-library/react';
import { WebMidi as wm } from 'webmidi';
export * from '@testing-library/react'
export {customRender as render}

import WebMidiContext, { WebMidiContextProvider } from '../contexts/WebMidiContext'
import { VolcaFMContextProvider } from '../contexts/VolcaFMContext'

//Think about a thinner wrapper that mocks midiContext instead of webmidi

//Think about how to mock the VolcaFMContext too - even thinner, higher up
export const customRender = (
  ui,
  options,
) => {
  const Wrapper = ({ children }) => {
      const { WebMidi = wm, manufacturer = 0x11, channel = 3  } = options
      return (
        <>
        <WebMidiContextProvider manufacturer={manufacturer} WebMidi={WebMidi}>
          <WebMidiContext.Consumer>
            {midiContext => (
              <VolcaFMContextProvider channel={channel} injectedMidiContext={midiContext}>
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