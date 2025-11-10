
import { MOTION_PARAMS } from './parseMotion';

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

export const adjustNoteData = (data) => {
  let { gateTime } = data
  console.log('adjustNoteData', gateTime)
  if(gateTime && gateTime > 100 && gateTime < 127) {
    gateTime = 127
  }
  return { ...data, gateTime }
}

export const parseStepBytes = (bytes) => {
  if (bytes.length < 112) {
    throw new Error('Invalid MIDI step data length. Expected 112 bytes, received ' + bytes.length);
  }

  const data = {
    notes: [],
    motionData: {},
    reserved30: [],
    reserved108: [],
  }

  for (let i = 0; i < 6; i++) {
    data.notes.push({
      id: i,
      note: [bytes[i * 2], bytes[(i * 2) + 1]],
      velocity: bytes[i + 18],
      gateTime: GATE_TIME_LOOKUP[bytes[24 + i] & 0x7F],
      trigger: (bytes[24 + i] & 0x80) !== 0,
    })
  }

  for (let i = 0; i < 12; i++) {
    data.reserved30[i] = bytes[i + 30]
  }

  for (let i = 0; i < MOTION_PARAMS.length; i++) {
    const paramName = MOTION_PARAMS[i]
    const paramValues = []
    for (let j = 0; j < 5; j++) {
      paramValues.push(bytes[43 + (i * 5) + j])
    }
    data.motionData[paramName] = paramValues
  }

  for (let i = 0; i < 4; i++) {
    data.reserved108[i] = bytes[i + 108]
  }

  return data
}

export const packStepData = (data) => {
    const bytes = new Array(112).fill(0)

    for(let i = 0;i < 6;i++) {
      bytes[i * 2] = data.notes[i].note[0] & 0xFF
      bytes[(i * 2) + 1] = data.notes[i].note[1] & 0xFF
      bytes[i + 18] = data.notes[i].velocity
      bytes[24 + i] = ((data.notes[i].trigger & 1) << 7) | (GATE_TIME_LOOKUP.indexOf(data.notes[i].gateTime) & 0x7F)
    }
    // Reserved (Bytes 30-31): Typically not used
    for (let i = 0;i < 12;i++) {
      bytes[i + 30] = data.reserved30[i]
    }

    // Motion Data (Bytes 43-107)
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
        const paramName = MOTION_PARAMS[i];
        const paramValues = data.motionData[paramName]
        for(let j = 0;j < 5;j++) {
          bytes[43 + (i * 5) + j] = paramValues[j]
        }
    }

    // Reserved (Bytes 108-111): Typically not used
    for (let i = 0;i < 4;i++) {
      bytes[i + 108] = data.reserved108[i]
    }
  
    return bytes
  }