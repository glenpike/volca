import { SequenceInfo, NoteInfo, StepInfo } from "./volca";

export interface VolcaState {
  currentSequenceNumber: number
  sequences: SequenceInfo[]
  setCurrentSequenceNumber: (number: number) => void
  getCurrentSequenceNumber: () => number | null
  getSequence: (number: number) => SequenceInfo | null
  clearSequences: () => void
  addOrUpdateSequence: (sequence: SequenceInfo, id?: number) => void
  updateStep: (
    sequenceId: number,
    stepId: number,
    updatedData: Partial<StepInfo>
  ) => void
  updateNote: (
    sequenceId: number,
    stepId: number,
    noteId: number,
    updatedData: Partial<NoteInfo>
  ) => void
}