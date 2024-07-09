import WebMidiContext, { WebMidiContextProvider } from './contexts/WebMidiContext'
import { WebMidi } from 'webmidi'
import TestMidiContext, { TestMidiContextProvider } from './contexts/TestMidiContext';
import { VolcaFMContextProvider } from './contexts/VolcaFMContext'
import Wrapper from './Wrapper';

import './App.css';

const KORG_MANUFACTURER_ID = 0x42
const MIDI_CHANNEL = 3

function App() {
  return (
    <>
      {/* <WebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}, WebMidi={WebMidi}>
            <WebMidiContext.Consumer>
      */}
      <TestMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}>
        <TestMidiContext.Consumer>
          {midiContext => (
            <VolcaFMContextProvider channel={MIDI_CHANNEL} injectedMidiContext={midiContext}>
              <div className="App">
                <Wrapper />
              </div>
            </VolcaFMContextProvider>
          )}
        </TestMidiContext.Consumer>
      </TestMidiContextProvider>
      {/* 
        </WebMidiContext.Consumer>
      </WebMidiContextProvider> */}
    </>
  )
}

export default App;
