/**
 * Shared TypeScript types for Volca sequencer data structures
 */

// Constants
export const MOTION_PARAM_NAMES = [
  'transpose', 'velocity', 'algorithm', 'modulatorAttack', 'modulatorDecay',
  'carrierAttack', 'carrierDecay', 'lfoRate', 'lfoPitchDepth', 'arpType',
  'arpDiv', 'chorusDepth', 'reverbDepth'
];

export const ARP_TYPES = [
  'OFF', 'RISE 1', 'RISE 2', 'RISE 3', 'FALL 1', 'FALL 2', 'FALL 3',
  'RAND 1', 'RAND 2', 'RAND 3'
];

export const ARP_DIVISIONS = [
  '1/12 STEP', '1/8 STEP', '1/4 STEP', '1/3 STEP', '1/2 STEP',
  '2/3 STEP', '1/1 STEP', '3/2 STEP', '2/1 STEP', '3/1 STEP',
  '4/1 STEP'
];

export const MOTION_SWITCH_NAMES = ['onOff', 'smooth', 'warpActiveStep', 'tempo1', 'tempo', 'voiceMono', 'voiceUnison', 'chorus']
export const TOGGLE_SWITCH_NAMES = ['arp', 'transposeNote', 'reverb']
export const TEMPO_VALUES = ['1/1', '1/2', '1/4'];

// Basic types for documentation / abstraction
export type ByteArray = Uint8Array;
export type ByteBuffer = number[]; // For compatibility with existing code

export type SettingsBytes = Uint8Array; // 6 bytes
export type StepBytes = Uint8Array;     // 112 bytes  
export type SequenceBytes = Uint8Array; // 1920 bytes

// Motion parameter names as defined in parseMotion.js
type MotionParamNameTuple = typeof MOTION_PARAM_NAMES;
export type MotionParamName = MotionParamNameTuple[number];

// Arpeggiator types
type ArpTypeTuple = typeof ARP_TYPES;
export type ArpType = ArpTypeTuple[number];

// Arpeggiator divisions
type ArpDivTuple = typeof ARP_DIVISIONS;
export type ArpDiv = ArpDivTuple[number];

// Tempo values
type TempoTuple = typeof TEMPO_VALUES;
export type Tempo = TempoTuple[number];

// Motion switch names
type MotionSwitchNamesTuple = typeof MOTION_SWITCH_NAMES;
export type MotionSwitchNames = MotionSwitchNamesTuple[number];

// Toggle switch names
type ToggleSwitchNamesTuple = typeof TOGGLE_SWITCH_NAMES;
export type ToggleSwitchNames = ToggleSwitchNamesTuple[number];

// Individual Note interface
export interface NoteInfo {
  id: number;
  note: [number, number]; // [noteNumber, otherNoteValue] - MIDI note data
  velocity: number; // 0-127
  gateTime: string | number; // FIXME!! Gate time value, can be string from lookup or number
  trigger: boolean; // Whether this note is triggered
}

// Motion data for parameters
export type MotionData = {
  [K in MotionParamName]: number[];
}

// Motion switches for each step
export type MotionSwitches = {
  [K in MotionSwitchNames]: boolean
}

// Toggle switches
export type ToggleSwitches = {
  [K in ToggleSwitchNames]: boolean
}

// Sequence settings
export interface SequenceSettings {
  motionSwitches: MotionSwitches;
  toggleSwitches: ToggleSwitches;
  arpType: ArpType;
  arpDiv: ArpDiv;
  tempo: Tempo;
  chorusDepth: number; // 0-127
  reverbDepth: number; // 0-127
}

// Individual Step interface
export interface StepInfo {
  id: number;
  on: boolean; // Step on/off status
  active: boolean; // Step active status
  motionFuncTranspose: boolean; // Motion function transpose on/off
  notes: NoteInfo[]; // Array of up to 6 notes per step
  motionData: MotionData; // Motion parameter data for this step
  reserved30: ByteArray; // Reserved bytes 30-41 (12 bytes)
  reserved108: ByteArray; // Reserved bytes 108-111 (4 bytes)
}

// Reserved data structure for sequence
export interface SequenceReserved {
  reserved4_5: [number, number];
  reserved8: number;
  reserved10_11: [number, number];
  reserved14: number;
  reserved74_79: ByteArray; // 6 bytes
  reserved1888_1915: ByteArray; // 27 bytes
}

export type SequenceMotionValues = Record<MotionParamName, number>
// Motion data at sequence level
export interface SequenceMotionData {
  switches: Array<SequenceMotionValues>; // 16 steps worth of switches
  motion: SequenceMotionValues; // Motion parameter values
}

// Complete Sequence interface
export interface SequenceInfo {
  numberOfSteps: number; // Number of steps in sequence (typically 16)
  programNumber: number; // Program/sequence number
  motionData: SequenceMotionData; // Sequence-level motion data
  sequenceSettings: SequenceSettings; // Global sequence settings
  steps: StepInfo[]; // Array of step data
  reserved: SequenceReserved; // Reserved/unused bytes
}

// Store state interface
export interface VolcaStoreState {
  currentSequenceNumber: number | null;
  sequences: SequenceInfo[];
  setCurrentSequenceNumber: (number: number) => void;
  getSequence: (number: number) => SequenceInfo | null;
  clearSequences: () => void;
  addOrUpdateSequence: (sequence: SequenceInfo) => void;
  updateNote: (sequenceId: number, stepId: number, noteId: number, updatedData: Partial<NoteInfo>) => void;
}

// Utility types for parsing functions
export interface ParsedStepData {
  notes: NoteInfo[];
  motionData: MotionData;
  reserved30: ByteArray;
  reserved108: ByteArray;
}

export interface PackedMotionData {
  paramBytes: ByteArray;
  switchBytes: ByteArray;
}

