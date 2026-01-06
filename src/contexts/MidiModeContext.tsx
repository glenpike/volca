import { createContext, useContext } from "react";

export type MidiMode = 'real' | 'test'
type MidiModeContextValue = {
  mode: MidiMode;
  setMode: (m: MidiMode) => void;
};
const MidiModeContext = createContext<MidiModeContextValue>({
  mode: 'test',
  setMode: (_m: MidiMode) => { },
});

export default MidiModeContext;
export const useMidiMode = () => useContext(MidiModeContext);