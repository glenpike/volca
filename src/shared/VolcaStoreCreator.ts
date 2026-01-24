import { StateCreator } from 'zustand';
import { NoteInfo, StepInfo, VolcaState } from '../types';

export const CURRENT_VOLCA_SEQUENCE_INDEX: number = 16

/**
 * TODO: 
 * Look at using 'combine' for separating initial state from actions
 * https://zustand.docs.pmnd.rs/guides/beginner-typescript#combine-middleware
 * Resetting the store?
 * https://zustand.docs.pmnd.rs/guides/beginner-typescript#resetting-the-store
 */
export const VolcaStoreCreator: StateCreator<VolcaState> = ((set, get) => ({
  currentSequenceNumber: -1,
  sequences: [],
  getCurrentSequenceNumber: () => get().currentSequenceNumber,
  getSequence: (number: number) => {
    const state = get()
    const sequence = state.sequences[number];
    if (sequence) {
      return sequence;
    }
    return null;
  },
  clearSequences: () => set({ currentSequenceNumber: -1, sequences: [] }),
  addOrUpdateSequence: (sequence, id) => set((state: any) => {
    const updatedSequences = [...state.sequences];
    const sequenceIndex = id === undefined ? CURRENT_VOLCA_SEQUENCE_INDEX : id
    updatedSequences[sequenceIndex] = sequence;
    // console.log('setting current sequence number to ', sequenceIndex)
    return { currentSequenceNumber: sequenceIndex, sequences: updatedSequences };
  }),
  updateStep: (sequenceId: number, stepId: number, updatedData: Partial<StepInfo>) => set((state: any) => {
    // console.log('updateStep ', sequenceId)
    const sequence = state.sequences[sequenceId];
    if (sequence) {
      // console.log('updateStep sequence', stepId)
      const stepIndex = sequence.steps.findIndex((step: StepInfo) => step.id === stepId);
      // console.log('updateStep stepIndex', stepIndex)
      if (stepIndex !== -1) {
        // console.log('updateStep step', updatedData)
        sequence.steps[stepIndex] = {
          ...sequence.steps[stepIndex],
          ...updatedData,
        };
      }
    }
    return { sequences: [...state.sequences] };
  }),
  updateNote: (sequenceId: number, stepId: number, noteId: number, updatedData: Partial<NoteInfo>) => set((state: any) => {
    // console.log('updateNote ', sequenceId)
    const sequence = state.sequences[sequenceId];
    if (sequence) {
      // console.log('updateNote sequence', stepId, noteId)
      const step = sequence.steps.find((step: StepInfo) => step.id === stepId);
      if (step) {
        const noteIndex = step.notes.findIndex((note: NoteInfo) => note.id === noteId);
        // console.log('updateNote step', noteId, noteIndex)
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
