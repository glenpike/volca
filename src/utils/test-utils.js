import { render } from '@testing-library/react';
import { WebMidi as wm } from 'webmidi';
export * from '@testing-library/react'
import WebMidiContext, { WebMidiContextProvider } from '../contexts/WebMidiContext'
import { VolcaFMContextProvider } from '../contexts/VolcaFMContext'

export const webmidiRender = (
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
  return  render(ui, { wrapper: Wrapper, ...options })
}

export const volcaRender = (
  ui,
  options,
) => {
  const Wrapper = ({ children }) => {
      const { midiContext, channel = 3  } = options
      return (
        <VolcaFMContextProvider channel={channel} injectedMidiContext={midiContext}>
          {children}
        </VolcaFMContextProvider>
      )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}