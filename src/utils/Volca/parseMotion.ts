import {
  MOTION_PARAM_NAMES,
  ByteArray,
  SequenceMotionData,
  SequenceMotionValues
} from '../../types';

const packSwitchesForSteps = (switches: Array<SequenceMotionValues>, switchBytes: number[], paramIndex: number) => {
  let switchByte = 0
  for (let i = 0; i < 16; i++) {
    switchByte |= (switches[i][MOTION_PARAM_NAMES[paramIndex]] & 1) << i
  }
  switchBytes.push(switchByte >> 8)
  switchBytes.push(switchByte & 0xFF)
}

export const packMotionData = ({ motion, switches }: SequenceMotionData): { paramBytes: ByteArray, switchBytes: ByteArray } => {
  const paramBytes: number[] = []
  const switchBytes: number[] = []
  for (let i = 0; i < MOTION_PARAM_NAMES.length; i++) {
    const paramName = MOTION_PARAM_NAMES[i];
    const paramValue = motion[paramName]
    paramBytes.push(paramValue >> 8)
    paramBytes.push(paramValue & 0xFF)
    packSwitchesForSteps(switches, switchBytes, i)
  }
  return { paramBytes: new Uint8Array(paramBytes), switchBytes: new Uint8Array(switchBytes) }
}

export const parseMotionBytes = (paramBytes: ByteArray, switchBytes: ByteArray): SequenceMotionData => {
  const motionSwitchData: SequenceMotionData = {
    motion: {} as SequenceMotionValues,
    switches: new Array(16).fill({}) as Array<SequenceMotionValues>
  }
  const { motion, switches } = motionSwitchData
  for (let i = 0; i < MOTION_PARAM_NAMES.length; i++) {
    const paramName = MOTION_PARAM_NAMES[i];
    const paramValue = (paramBytes[2 * i] << 8) | paramBytes[1 + 2 * i];
    motion[paramName] = paramValue
    parseSwitchesForSteps(switches, switchBytes, i)
  }
  return { switches, motion }
}

const parseSwitchesForSteps = (switches: Array<SequenceMotionValues>, switchBytes: ByteArray, paramIndex: number) => {
  const byteIndex = paramIndex < 8 ? 0 : 1
  const bitIndex = paramIndex % 8
  for (let i = 0; i < 16; i++) {
    switches[i][MOTION_PARAM_NAMES[paramIndex]] = (switchBytes[byteIndex + 2 * i] >> bitIndex) & 1
  }
}