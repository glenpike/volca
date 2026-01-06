
import { useState, useMemo } from "react";
import WebMidiContext, { WebMidiContextProvider } from '../../contexts/WebMidiContext'
import { WebMidi } from 'webmidi'
import TestMidiContext, { TestMidiContextProvider } from '../../contexts/TestMidiContext';
import { VolcaFMContextProvider } from '../../contexts/VolcaFMContext'
import MidiModeContext, { MidiMode } from '../../contexts/MidiModeContext'

const KORG_MANUFACTURER_ID = 0x42
const MIDI_CHANNEL = 1

const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<MidiMode>(() => {
    const urlMode = new URLSearchParams(window.location.search).get('midiMode');
    if (urlMode === 'real' || urlMode === 'test') return urlMode;
    const stored = window.localStorage.getItem('midiMode');
    if (stored === 'real' || stored === 'test') return stored;
    return 'test'; // default
  });

  const value = useMemo(
    () => ({
      mode,
      setMode: (next: MidiMode) => {
        window.localStorage.setItem('midiMode', next);
        setMode(next);
      },
    }),
    [mode]
  );
  const midiTree =
    mode === 'real' ? (
      <WebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID} WebMidi={WebMidi}>
        <WebMidiContext.Consumer>
          {midiContext => (
            <VolcaFMContextProvider channel={MIDI_CHANNEL} injectedMidiContext={midiContext}>
              {children}
            </VolcaFMContextProvider>
          )}
        </WebMidiContext.Consumer>
      </WebMidiContextProvider>
    ) : (
      <TestMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}>
        <TestMidiContext.Consumer>
          {midiContext => (
            <VolcaFMContextProvider channel={MIDI_CHANNEL} injectedMidiContext={midiContext}>
              {children}
            </VolcaFMContextProvider>
          )}
        </TestMidiContext.Consumer>
      </TestMidiContextProvider>
    );
  return (
    <MidiModeContext.Provider value={value}>
      {midiTree}
    </MidiModeContext.Provider>
  );
}

export default MidiProvider