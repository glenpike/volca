export const MOTION_PARAMS = [
  'transpose', 'velocity', 'algorithm', 'modulatorAttack', 'modulatorDecay',
  'carrierAttack', 'carrierDecay', 'lfoRate', 'lfoPitchDepth', 'arpType',
  'arpDiv', 'chorusDepth', 'reverbDepth'
];

const packSwitchesForSteps = (switches, switchBytes, paramIndex) => {
  let switchByte = 0
  for (let i = 0; i < 16; i++) {
    switchByte |= (switches[i][MOTION_PARAMS[paramIndex]] & 1) << i
  }
  switchBytes.push(switchByte >> 8)
  switchBytes.push(switchByte & 0xFF)
}

export const packMotionData = ({ motion, switches }) => {
  const paramBytes = []
  const switchBytes = []
  for (let i = 0; i < MOTION_PARAMS.length; i++) {
    const paramName = MOTION_PARAMS[i];
    const paramValue = motion[paramName]
    paramBytes.push(paramValue >> 8)
    paramBytes.push(paramValue & 0xFF)
    packSwitchesForSteps(switches, switchBytes, i)
  }
  return { paramBytes, switchBytes }
}

export const parseMotionBytes = (paramBytes, switchBytes) => {
  const motion = {}
  const switches = new Array(16).fill({})
  for (let i = 0; i < MOTION_PARAMS.length; i++) {
    const paramName = MOTION_PARAMS[i];
    const paramValue = (paramBytes[2 * i] << 8) | paramBytes[1 + 2 * i];
    motion[paramName] = paramValue
    parseSwitchesForSteps(switches, switchBytes, i)
  }
  return { switches, motion }
}

const parseSwitchesForSteps = (switches, switchBytes, paramIndex) => {
  const byteIndex = paramIndex < 8 ? 0 : 1
  const bitIndex = paramIndex % 8
  for (let i = 0; i < 16; i++) {
    switches[i][MOTION_PARAMS[paramIndex]] = (switchBytes[byteIndex + 2 * i] >> bitIndex) & 1
  }
}