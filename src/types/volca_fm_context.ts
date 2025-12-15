import { MidiContextType } from "./midi_context";

export interface VolcaFMContextType {
  deviceInquiry: () => void,
  currentChannel: number,
  setCurrentChannel: (channel: number) => void,
  loadSequenceNumber: (sequenceNumber: number) => void,
  saveSequenceNumber: (sequenceNumber: number) => void,
  loadCurrentSequence: () => void,
  webMidiContext: MidiContextType | null,
}