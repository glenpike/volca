import { create } from 'zustand';
import { SequenceInfo, NoteInfo, StepInfo, VolcaState } from '../types';


export const useVolcaStore = create<VolcaState>((set, get) => ({
  currentSequenceNumber: null,
  sequences: [],
  setCurrentSequenceNumber: (number: number) => set({ currentSequenceNumber: number }),
  getSequence: (number: number) => {
    const state = get()
    const sequence = state.sequences.find((seq: SequenceInfo) => seq.programNumber === number);
    if (sequence) {
      return sequence;
    }
    return null;
  },
  clearSequences: () => set({ sequences: [] }),
  addOrUpdateSequence: (sequence: SequenceInfo) => set((state: any) => {
    const existingSequenceIndex = state.sequences.findIndex((seq: SequenceInfo) => seq.programNumber === sequence.programNumber);
    if (existingSequenceIndex !== -1) {
      // Overwrite the existing sequence
      const updatedSequences = [...state.sequences];
      updatedSequences[existingSequenceIndex] = sequence;
      return { sequences: updatedSequences };
    } else {
      // Add the new sequence
      return { sequences: [...state.sequences, sequence] };
    }
  }),
  // updateStep: (sequenceId, stepId, updatedData) => set((state) => {
  //   const sequence = state.sequences.find((seq) => seq.id === sequenceId);
  //   if (sequence) {
  //     const stepIndex = sequence.steps.findIndex((step) => step.id === stepId);
  //     if (stepIndex !== -1) {
  //       sequence.steps[stepIndex] = {
  //         ...sequence.steps[stepIndex],
  //         ...updatedData,
  //       };
  //     }
  //   }
  //   return { sequences: [...state.sequences] };
  // }),
  updateNote: (sequenceId: number, stepId: number, noteId: number, updatedData: Partial<NoteInfo>) => set((state: any) => {
    console.log('updateNote ', sequenceId)
    const sequence = state.sequences.find((seq: SequenceInfo) => seq.programNumber === sequenceId);
    if (sequence) {
      console.log('updateNote sequence', stepId, noteId)
      const step = sequence.steps.find((step: StepInfo) => step.id === stepId);
      if (step) {
        const noteIndex = step.notes.findIndex((note: NoteInfo) => note.id === noteId);
        console.log('updateNote step', noteId, noteIndex)
        if (noteIndex !== -1) {
          step.notes[noteIndex] = {
            ...step.notes[noteIndex],
            ...updatedData,
          };
        }
      }
    }
    return { sequences: [...state.sequences] };
  }),
}));