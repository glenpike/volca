import { render as rtlRender } from '@testing-library/react';
export * from '@testing-library/react'
export {customRender as render}

import WebMidiContext, { WebMidiContextProvider } from '../contexts/WebMidiContext'
import { VolcaFMContextProvider } from '../contexts/VolcaFMContext'

export const customRender = (
  ui,
  options,
) => {
  const Wrapper = ({ children }) => {
      const { WebMidi, manufacturer = 0x11, channel = 3  } = options
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