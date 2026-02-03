import { MOTION_PARAM_NAMES, NoteInfo, ByteArray, ParsedStepInfo, MotionData } from '../../types';

export const GATE_TIME_LOOKUP = [
  "0", "1", "3", "4", "6", "7", "8", "10",
  "11", "13", "14", "15", "17", "18", "19", "21",
  "22", "24", "25", "26", "28", "29", "31", "32",
  "33", "35", "36", "38", "39", "40", "42", "43",
  "44", "46", "47", "49", "50", "51", "53", "54",
  "56", "57", "58", "60", "61", "63", "64", "65",
  "67", "68", "69", "71", "72", "74", "75", "76",
  "78", "79", "81", "82", "83", "85", "86", "88",
  "89", "90", "92", "93", "94", "96", "97", "99",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "100",
  "100", "100", "100", "100", "100", "100", "100", "127"
]

export const getGateTimeString = (gateTimeInt: number): string => {
  return GATE_TIME_LOOKUP[gateTimeInt]
}

export const parseStepBytes = (bytes: ByteArray): ParsedStepInfo => {
  if (bytes.length < 112) {
    throw new Error('Invalid MIDI step data length. Expected 112 bytes, received ' + bytes.length);
  }

  const notes: Array<NoteInfo> = []
  const reserved30: number[] = []
  const reserved108: number[] = []
  const motionData: MotionData = {}

  for (let i = 0; i < 6; i++) {
    notes.push({
      id: i,
      note: [bytes[i * 2], bytes[(i * 2) + 1]],
      velocity: bytes[i + 18],
      gateTimeInt: bytes[24 + i] & 0x7F,
      trigger: (bytes[24 + i] & 0x80) !== 0,
    })
  }

  for (let i = 0; i < 12; i++) {
    reserved30[i] = bytes[i + 30]
  }

  for (let i = 0; i < MOTION_PARAM_NAMES.length; i++) {
    const paramName = MOTION_PARAM_NAMES[i]
    const paramValues = []
    for (let j = 0; j < 5; j++) {
      paramValues.push(bytes[43 + (i * 5) + j])
    }
    motionData[paramName] = paramValues
  }

  for (let i = 0; i < 4; i++) {
    reserved108[i] = bytes[i + 108]
  }

  return {
    notes,
    motionData,
    reserved30: new Uint8Array(reserved30),
    reserved108: new Uint8Array(reserved108),
  }
}

export const packStepData = (data: ParsedStepInfo) => {
  const bytes = new Array(112).fill(0)

  const notes: Array<NoteInfo> = data.notes

  for (let i = 0; i < 6; i++) {
    bytes[i * 2] = notes[i].note[0] & 0xFF
    bytes[(i * 2) + 1] = notes[i].note[1] & 0xFF
    bytes[i + 18] = notes[i].velocity
    bytes[24 + i] = ((notes[i].trigger ? 1 : 0) << 7) | (notes[i].gateTimeInt & 0x7F)
  }
  // Reserved (Bytes 30-31): Typically not used
  for (let i = 0; i < 12; i++) {
    bytes[i + 30] = data.reserved30[i]
  }

  // Motion Data (Bytes 43-107)
  for (let i = 0; i < MOTION_PARAM_NAMES.length; i++) {
    const paramName = MOTION_PARAM_NAMES[i];
    const paramValues = data.motionData[paramName]
    for (let j = 0; j < 5; j++) {
      bytes[43 + (i * 5) + j] = paramValues[j]
    }
  }

  // Reserved (Bytes 108-111): Typically not used
  for (let i = 0; i < 4; i++) {
    bytes[i + 108] = data.reserved108[i]
  }

  return bytes
}