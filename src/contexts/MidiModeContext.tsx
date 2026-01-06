import { createContext, useContext } from "react";

const MidiModeContext = createContext({
  mode: 'test',
  setMode: (_m: 'real' | 'test') => { },
});

export default MidiModeContext;
export const useMidiMode = () => useContext(MidiModeContext);