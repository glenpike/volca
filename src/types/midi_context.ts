export type SentSysexMessage = {
  manufacturer: number;
  data: Uint8Array;
}

export interface MidiContextType {
  midiInitialised: boolean;
  currentOutput: any | null; // or more specific MIDI output type
  currentInput: any | null;  // or more specific MIDI input type
  midiOutputs: any[] | null; // or more specific array type
  midiInputs: any[] | null;
  lastTxSysexMessage: SentSysexMessage | null;
  lastRxSysexMessage: Uint8Array | null;
  initialise: () => void;
  setManufacturer: (manufacturer: number) => void;
  setCurrentOutput: (output: any) => void; // or specific type
  setCurrentInput: (input: any) => void;
  getCurrentOutput: () => any | null;
  getCurrentInput: () => any | null;
  sendSysexMessage: (message: any) => void; // or specific message type
  sendUniversalMessage: (manufacturer: number, data: Uint8Array) => void;
}