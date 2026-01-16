import { SequenceInfo, NoteInfo } from "./volca";

export interface VolcaState {
  currentSequenceNumber: number | null
  sequences: SequenceInfo[]
  setCurrentSequenceNumber: (number: number) => void
  getCurrentSequenceNumber: () => number | null
  getSequence: (number: number) => SequenceInfo | null
  clearSequences: () => void
  addOrUpdateSequence: (sequence: SequenceInfo) => void
  updateNote: (
    sequenceId: number,
    stepId: number,
    noteId: number,
    updatedData: Partial<NoteInfo>
  ) => void
}