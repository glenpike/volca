import Step from "./Sequence/Step"
import Motion from "./Sequence/Motion"
import Settings from "./Sequence/Settings"

class VolcaSequence {
  constructor(number) {
    this._number = number
  }

  fromBytes = (sequenceBytes) => {
    // this._number = sequenceBytes.shift()
    // this._midi8BitData = convert7to8bit(sequenceBytes)
    this._unpackSequenceData(sequenceBytes)
  }

  toBytes() {    
    // const packedData = convert8to7bit(this._packSequenceData())
    // return [this._number].concat(packedData)
    return this._packSequenceData()
  }

  get number() {
    return this._number
  }

  set number(number) {
    this._number = number
  }

  get programNumber() {
    return this._programNumber
  }

  set programNumber(programNumber) {
    this._programNumber = programNumber
  }

  get steps() {
    return this._steps
  }

  set steps(steps) {
    this._steps = steps
  }

  get motionData() {
    return this._motionData
  }

  set motionData(motionData) {
    this._motionData = motionData
  }

  get sequenceSettings() {
    return this._sequenceSettings
  }

  set sequenceSettings(sequenceSettings) {
    this._sequenceSettings = sequenceSettings
  }

  get reserved() {
    return this._reserved
  }

  set reserved(reserved) {  
    this._reserved = reserved
  }

  _unpackSequenceData(data) {
    const header = String.fromCharCode(data[0], data[1], data[2], data[3]);
    if (header !== 'PTST') {
        throw new Error('Invalid header');
    }

    const reserved4_5 = [data[4], data[5]]

    // Parse the number of steps
    const numberOfSteps = data[15];
    // Initialize an array to hold the step objects
    this._steps = Array.from({ length: numberOfSteps }, () => ({}));
    console.log('Number of steps: ', numberOfSteps)
    
    // Parse the step On/Off status
    
    const reserved8 = data[8]

    this._programNumber = data[9]

    const reserved10_11 = [data[10], data[11]]

    const reserved14 = data[14]

    //Bytes 42-68 are the 2 byte groups with switches for the steps for each Motion Param type!!
    this._motionData = new Motion()
    this._motionData.fromBytes(data.slice(16, 42), data.slice(42, 68))

    this._sequenceSettings = new Settings()
    this._sequenceSettings.fromBytes(data.slice(68, 74))

    // Reserved (Bytes 74-79): Typically not used
    const reserved74_79 = []
    for (let i = 0;i < 6;i++) {
      reserved74_79[i] = data[i + 74]
    }

    // Parse the step-specific data
    // Parse the step ACTIVE status
    // Parse the transpose status
    // Parse the step MOTION FUNC TRANSPOSE Off/On status
    for (let i = 0; i < numberOfSteps; i++) {
      const onOffByteIndex = i < 8 ? 6 : 7;
      const bitIndex = i % 8;
      const activeByteIndex = i < 8 ? 12 : 13;
      const stepOnOff = !!((data[onOffByteIndex] >> bitIndex) & 1);
      const stepActive = !!((data[activeByteIndex] >> bitIndex) & 1);
      const stepDataOffset = 80 + i * 112;
      const stepData = data.slice(stepDataOffset, stepDataOffset + 112)
      const stepMotionFuncTranspose = !!(data[1872 + i] & 1);
      this._steps[i] = new Step({
          id: i, 
          on: stepOnOff,
          active: stepActive,
          motionFuncTranspose: stepMotionFuncTranspose 
        }).fromBytes(stepData);
    }

    // Reserved (Bytes 1888-1915): Typically not used
    const reserved1888_1915 = []
    for (let i = 0;i < 27;i++) {
      reserved1888_1915[i] = data[i + 1888]
    }

    // Check the footer
    const footer = String.fromCharCode(data[1916], data[1917], data[1918], data[1919]);
    if (footer !== 'PTED') {
        throw new Error('Invalid footer');
    }
    this._reserved = {
      reserved4_5,
      reserved8,
      reserved10_11,
      reserved14,
      reserved74_79,
      reserved1888_1915
    }
  }

  //TODO - reserved bytes!
  _packSequenceData() {
    const numberOfSteps = this._steps.length
    const data = new Array(1919).fill(0)
    
    const {
      reserved4_5,
      reserved8,
      reserved10_11,
      reserved14,
      reserved74_79,
      reserved1888_1915
    } = this._reserved

    data[0] = 'P'.charCodeAt(0)
    data[1] = 'T'.charCodeAt(0)
    data[2] = 'S'.charCodeAt(0)
    data[3] = 'T'.charCodeAt(0)
    data[4] = reserved4_5[0]
    data[5] = reserved4_5[1]
    
    // Pack the step On/Off status
    for (let i = 0; i < numberOfSteps; i++) {
      const byteIndex = i < 8 ? 6 : 7
      const bitIndex = i % 8
      data[byteIndex] |= (this._steps[i].on & 1) << bitIndex
    }

    data[8] = reserved8
    data[9] = this._programNumber
    data[10] = reserved10_11[0]
    data[11] = reserved10_11[1]

    data[14] = reserved14
    data[15] = numberOfSteps

    // Pack the motion param values and on/off
    const { paramBytes, switchBytes } = this._motionData.toBytes()
    paramBytes.forEach((value, i) => {
      data[16 + i] = value
    })
    switchBytes.forEach((value, i) => {
      data[42 + i] = value
    })

    // Pack the sequence settings
    const settingsBytes = this._sequenceSettings.toBytes()
    settingsBytes.forEach((value, i) => {
      data[68 + i] = value
    })

    for (let i = 0;i < 6;i++) {
      data[i + 74] = reserved74_79[i]
    }

    // Pack the step-specific data
    for (let i = 0; i < numberOfSteps; i++) {
      const step = this._steps[i]
      const byteIndex = i < 8 ? 12 : 13;
      const bitIndex = i % 8;
      const onOffByteIndex = i < 8 ? 6 : 7;
      data[byteIndex] |= (step.active & 1) << bitIndex
      data[onOffByteIndex] |= (step.on & 1) << bitIndex
      const stepDataOffset = 80 + i * 112;      
      Array.from(step.toBytes()).forEach((value, j) => {
        data[stepDataOffset + j] = value
      })
      data[1872 + i] = step.motionFuncTranspose & 1
    }

    for (let i = 0;i < 27;i++) {
      data[i + 1888] = reserved1888_1915[i]
    }

    // Pack the footer
    data[1916] = 'P'.charCodeAt(0)
    data[1917] = 'T'.charCodeAt(0)
    data[1918] = 'E'.charCodeAt(0)
    data[1919] = 'D'.charCodeAt(0)

    return data
  }
}

export default VolcaSequence