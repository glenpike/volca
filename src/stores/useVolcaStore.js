import { create } from 'zustand';

export const useVolcaStore = create((set) => ({
  currentSequenceNumber: null,
  sequences: [],
  setCurrentSequenceNumber: (number) => set({ currentSequenceNumber: number }),
  getSequence: (number) => set((state) => {
    const sequence = state.sequences.find((seq) => seq.programNumber === number);
    if (sequence) {
      return sequence;
    }
    return null;
  }),
  clearSequences: () => set({ sequences: [] }),
  addOrUpdateSequence: (sequence) => set((state) => {
    const existingSequenceIndex = state.sequences.findIndex((seq) => seq.programNumber === sequence.programNumber);
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
  // updateNote: (sequenceId, stepId, noteId, updatedData) => set((state) => {
  //   const sequence = state.sequences.find((seq) => seq.id === sequenceId);
  //   if (sequence) {
  //     const step = sequence.steps.find((step) => step.id === stepId);
  //     if (step) {
  //       const noteIndex = step.notes.findIndex((note) => note.id === noteId);
  //       if (noteIndex !== -1) {
  //         step.notes[noteIndex] = {
  //           ...step.notes[noteIndex],
  //           ...updatedData,
  //         };
  //       }
  //     }
  //   }
  //   return { sequences: [...state.sequences] };
  // }),
}));