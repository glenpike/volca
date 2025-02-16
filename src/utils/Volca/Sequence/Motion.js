export const MOTION_PARAMS = [
  'transpose', 'velocity', 'algorithm', 'modulatorAttack', 'modulatorDecay',
  'carrierAttack', 'carrierDecay', 'lfoRate', 'lfoPitchDepth', 'arpType',
  'arpDiv', 'chorusDepth', 'reverbDepth'
];

class Motion {  
  fromBytes = (paramBytes, switchBytes) => {
    return this._unpackMotion(paramBytes, switchBytes)
  }

  toBytes = () => {
    return this._packMotion()
  }

  toJSON = () => {
    return JSON.stringify({ motion: this._motion, switches: this._switches })
  }

  get switches() {
    return this._switches
  }

  set switches(switches) {
    this._switches = switches
  }

  get motion() {
    return this._motion
  }

  set motion(motion) {
    this._motion = motion
  }

  _packMotion = () => {
    const paramBytes = []
    const switchBytes = []
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
      const paramName = MOTION_PARAMS[i];
      const paramValue = this._motion[paramName]
      paramBytes.push(paramValue >> 8)
      paramBytes.push(paramValue & 0xFF)
      this._packSwitchesForSteps(switchBytes, i)
    }
    return { paramBytes, switchBytes }
  }

  _unpackMotion = (paramBytes, switchBytes) => {
    this._motion = {}
    this._switches = new Array(16).fill({})
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
      const paramName = MOTION_PARAMS[i];
      const paramValue = (paramBytes[2 * i] << 8) | paramBytes[1 + 2 * i];
      this._motion[paramName] = paramValue
      this._unpackSwitchesForSteps(switchBytes, i)
    }
    return { switches: this._switches, motion: this._motion }
  }

  _unpackSwitchesForSteps = (switchBytes, paramIndex) => {
    const byteIndex = paramIndex < 8 ? 0 : 1
    const bitIndex = paramIndex % 8
    for (let i = 0; i < 16; i++) {
      this._switches[i][MOTION_PARAMS[paramIndex]] = (switchBytes[byteIndex + 2 * i] >> bitIndex) & 1
    }
  }

  _packSwitchesForSteps = (switchBytes, paramIndex) => {
    let switchByte = 0
    for (let i = 0; i < 16; i++) {
      switchByte |= (this._switches[i][MOTION_PARAMS[paramIndex]] & 1) << i
    }
    switchBytes.push(switchByte >> 8)
    switchBytes.push(switchByte & 0xFF)
  }
}

export default Motion