export interface WebMidiContextType {
  midiInitialised: boolean;
  currentOutput: any | null; // or more specific MIDI output type
  currentInput: any | null;  // or more specific MIDI input type
  midiOutputs: any[] | null; // or more specific array type
  midiInputs: any[] | null;
  lastTxSysexMessage: string | null;
  lastRxSysexMessage: string | null;
  initialise: () => void;
  setManufacturer: (manufacturer: number) => void;
  setCurrentOutput: (output: any) => void; // or specific type
  setCurrentInput: (input: any) => void;
  getCurrentOutput: () => any | null;
  getCurrentInput: () => any | null;
  sendSysexMessage: (message: any) => void; // or specific message type
  sendUniversalMessage: (identification: number, data: Uint8Array) => void;
}