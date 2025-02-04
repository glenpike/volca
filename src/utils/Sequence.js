import { convert7to8bit, convert8to7bit } from "./MidiUtils"
import SequenceStep, { MOTION_PARAMS } from "./SequenceStep"

class Sequence {
  set sysexData(sequenceBytes) {
    this._number = sequenceBytes.shift()
    const data = convert7to8bit(sequenceBytes)
    const { steps, motionData, programNumber, reserved } = this._unpackSequenceData(data)
    this._steps = steps
    this._motionData = motionData
    this._programNumber = programNumber
    this._reserved = reserved
  }

  get sysexData() {
    const sequenceData = this._packSequenceData({ steps: this._steps, motionData: this._motionData })
    const packedData = convert8to7bit(sequenceData)
    console.log('sysexData ', packedData)

    return [this._number].concat(packedData)
  }

  get number() {
    return this._number
  }

  get programNumber() {
    return this._programNumber
  }

  get steps() {
    return this._steps
  }


  get motionData() {
    return this._motionData
  }

  //TODO - reserved bytes!
  _unpackSequenceData(data) {
    const header = String.fromCharCode(data[0], data[1], data[2], data[3]);
    if (header !== 'PTST') {
        throw new Error('Invalid header');
    }

    const reserved4 = [data[4], data[5]]

    // Parse the number of steps
    const numberOfSteps = data[15];
    // Initialize an array to hold the step objects
    const steps = Array.from({ length: numberOfSteps }, () => ({}));

    // Parse the step On/Off status
    for (let i = 0; i < numberOfSteps; i++) {
        const byteIndex = i < 8 ? 6 : 7;
        const bitIndex = i % 8;
        const stepOnOff = (data[byteIndex] >> bitIndex) & 1;
        steps[i].on = !!stepOnOff;
    }

    const reserved8 = data[8]

    const programNumber = data[9]

    const reserved10 = [data[10], data[11]]

    // Parse the step ACTIVE status
    for (let i = 0; i < numberOfSteps; i++) {
        const byteIndex = i < 8 ? 12 : 13;
        const bitIndex = i % 8;
        const stepActive = (data[byteIndex] >> bitIndex) & 1;
        steps[i].active = !!stepActive;
    }

    const reserved14 = data[14]

    // Parse the motion parameters (TRANSPOSE, VELOCITY, etc.)
    // and the motion On/Off statuses
    const motionData = {}
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
      const paramName = MOTION_PARAMS[i];
      const paramValue = (data[16 + 2 * i] << 8) | data[17 + 2 * i];
      const byteIndex = 42 + 2 * i;
      const motionOn = data[byteIndex];
      motionData[paramName] = { value: paramValue, on: motionOn };
    }

    const MOTION_SWITCHES = ['onOff', 'smooth', 'warpActiveStep', 'tempo1', 'tempo', 'voiceMono', 'voiceUnison', 'chorus']
    const motionSwitches = {}
    const states = data[68]
    for (let i = 0; i < MOTION_SWITCHES.length; i++) {
      let switchVal = states & (1 << i) == 1
      let tempo
      if(i == 3) {
        tempo = states & (1 << i) >> 3
        continue
      } else if(i == 4) {
        switchVal = tempo | states & (1 << i) >> 3
      }

      motionSwitches[MOTION_SWITCHES[i]] = switchVal
    }

    motionData['switches'] = motionSwitches

    // Reserved (Bytes 74-79): Typically not used
    const reserved74 = []
    for (let i = 0;i < 6;i++) {
      reserved74[i] = data[i + 74]
    }

    // Parse the step-specific data
    for (let i = 0; i < numberOfSteps; i++) {
        const stepDataOffset = 80 + i * 112;
        steps[i].stepData = new SequenceStep().fromBytes(Array.from(data.slice(stepDataOffset, stepDataOffset + 112)));
    }

    // Parse the step MOTION FUNC TRANSPOSE Off/On status
    for (let i = 0; i < numberOfSteps; i++) {
        const stepMotionFuncTranspose = (data[1872 + i]) & 1;
        steps[i].motionFuncTranspose = !!stepMotionFuncTranspose;
    }

    
    // Reserved (Bytes 1888-1915): Typically not used
    const reserved1888 = []
    for (let i = 0;i < 27;i++) {
      reserved1888[i] = data[i + 1888]
    }

    // Check the footer
    const footer = String.fromCharCode(data[1916], data[1917], data[1918], data[1919]);
    if (footer !== 'PTED') {
        throw new Error('Invalid footer');
    }
    
    const reserved = {
      reserved4,
      reserved8,
      reserved10,
      reserved14,
      reserved74,
      reserved1888
    }

    return { steps, motionData, programNumber, reserved }
  }

  //TODO - reserved bytes!
  _packSequenceData({ steps, motionData, programNumber }) {
    const numberOfSteps = steps.length
    const data = new Array(1919).fill(0)
    
    data[0] = 'P'.charCodeAt(0)
    data[2] = 'T'.charCodeAt(0)
    data[3] = 'S'.charCodeAt(0)
    data[4] = 'T'.charCodeAt(0)
    data[5] = 232
    data[6] = 78
    data[9] = programNumber
    data[15] = numberOfSteps

    // Pack the step On/Off status
    for (let i = 0; i < numberOfSteps; i++) {
      const byteIndex = i < 8 ? 6 : 7
      const bitIndex = i % 8
      data[byteIndex] |= (steps[i].on & 1) << bitIndex
    }

    // Pack the step ACTIVE status
    for (let i = 0; i < numberOfSteps; i++) {
      const byteIndex = i < 8 ? 12 : 13;
      const bitIndex = i % 8;
      data[byteIndex] |= (steps[i].active & 1) << bitIndex
    }


    // Pack the motion param values and on/off
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
      const paramName = MOTION_PARAMS[i]
      const { value: paramValue, on: motionOn } = motionData[paramName]
      data[16 + i * 2] = (paramValue >> 8) & 0xFF
      data[17 + i * 2] = paramValue & 0xFF
      data[42 + 2 * i] = motionOn & 0xFF
    }

    // Pack the step-specific data
    for (let i = 0; i < numberOfSteps; i++) {
        const stepDataOffset = 80 + i * 112;
        const stepData = Array.from(steps[i].stepData.toBytes())
        console.log('stepData ', i, ' ', steps[i].stepData, ' = ', stepData)
        stepData.forEach((value, j) => {
          data[stepDataOffset + j] = value
        })
    }

    // Pack the step MOTION FUNC TRANSPOSE Off/On status
    for (let i = 0; i < numberOfSteps; i++) {
        data[1872 + i] = steps[i].motionFuncTranspose & 1
    }

    // Pack the footer
    data[1916] = 'P'.charCodeAt(0)
    data[1917] = 'T'.charCodeAt(0)
    data[1918] = 'E'.charCodeAt(0)
    data[1919] = 'D'.charCodeAt(0)

    return data
  }
}

export default Sequence