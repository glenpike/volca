import { Input, Output } from 'webmidi'

export type SentSysexMessage = {
  manufacturer: number;
  data: Uint8Array;
}

export interface MidiContextType {
  midiInitialised: boolean;
  currentOutput: Output | null;
  currentInput: Input | null;
  midiOutputs: Output[];
  midiInputs: Input[];
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