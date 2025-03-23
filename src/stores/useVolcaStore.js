// filepath: src/stores/useVolcaStore.js
import { create } from 'zustand';
// import { convert7to8bit, convert8to7bit } from '../utils/MidiUtils';
// import VolcaSequence from '../utils/Volca/Sequence';

const useVolcaStore = create((set) => ({
  // currentChannel: null,
  currentSequenceNumber: null,
  currentSequence: null,
  sequences: [],
  // setCurrentChannel: (channel) => set({ currentChannel: channel }),
  setCurrentSequenceNumber: (number) => set({ currentSequenceNumber: number }),
  // setCurrentSequence: (sequence) => set({ currentSequence: sequence }),
  addOrUpdateSequence: (sequence) => set((state) => {
    const existingSequenceIndex = state.sequences.findIndex((seq) => seq.programNumber === sequence.programNumber);
    console.log('addOrUpdateSequence existingSequenceIndex', existingSequenceIndex);
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
  updateNote: (sequenceId, stepId, noteId, updatedData) => set((state) => {
    const sequence = state.sequences.find((seq) => seq.id === sequenceId);
    if (sequence) {
      const step = sequence.steps.find((step) => step.id === stepId);
      if (step) {
        const noteIndex = step.notes.findIndex((note) => note.id === noteId);
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
  // parseNumberedSequence: (sequenceBytes) => {
  //   const sequenceNumber = sequenceBytes.shift();
  //   const sequence = new VolcaSequence(sequenceNumber);
  //   sequence.fromBytes(convert7to8bit(sequenceBytes));
  //   set((state) => ({ sequences: [...state.sequences, sequence] }));
  // },
  // parseCurrentSequence: (sequenceBytes) => {
  //   const sequence = new VolcaSequence(-1);
  //   sequence.fromBytes(convert7to8bit(sequenceBytes));
  //   set((state) => ({ sequences: [...state.sequences, sequence] }));
  // },
}));

export default useVolcaStore;