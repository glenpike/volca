import { packMotionData, parseMotionBytes } from "./parseMotion";
import { packSettingsData, parseSettingsBytes } from "./parseSettings";
import { parseStepBytes, packStepData } from "./parseStep";

export const parseSequenceBytes = (bytes) => {
  const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (header !== 'PTST') {
      throw new Error('Invalid header');
  }

  const reserved4_5 = [bytes[4], bytes[5]]

  // Parse the number of steps
  const numberOfSteps = bytes[15];
  // Initialize an array to hold the step objects
  const steps = Array.from({ length: numberOfSteps }, () => ({}));
  // console.log('Number of steps: ', numberOfSteps)
  
  // Parse the step On/Off status
  
  const reserved8 = bytes[8]

  const programNumber = bytes[9]

  const reserved10_11 = [bytes[10], bytes[11]]

  const reserved14 = bytes[14]

  //Bytes 42-68 are the 2 byte groups with switches for the steps for each Motion Param type!!
  const motionData = parseMotionBytes(bytes.slice(16, 42), bytes.slice(42, 68))

  const sequenceSettings = parseSettingsBytes(bytes.slice(68, 74))

  // Reserved (Bytes 74-79): Typically not used
  const reserved74_79 = []
  for (let i = 0;i < 6;i++) {
    reserved74_79[i] = bytes[i + 74]
  }

  // Parse the step-specific bytes
  // Parse the step ACTIVE status
  // Parse the transpose status
  // Parse the step MOTION FUNC TRANSPOSE Off/On status
  for (let i = 0; i < numberOfSteps; i++) {
    const onOffByteIndex = i < 8 ? 6 : 7;
    const bitIndex = i % 8;
    const activeByteIndex = i < 8 ? 12 : 13;
    const stepOnOff = !!((bytes[onOffByteIndex] >> bitIndex) & 1);
    const stepActive = !!((bytes[activeByteIndex] >> bitIndex) & 1);
    const stepDataOffset = 80 + i * 112;
    const stepData = bytes.slice(stepDataOffset, stepDataOffset + 112)
    const stepMotionFuncTranspose = !!(bytes[1872 + i] & 1);
    const { motionData, notes, reserved30, reserved108 } = parseStepBytes(stepData)
    steps[i] = {
      id: i, 
      on: stepOnOff,
      active: stepActive,
      motionFuncTranspose: stepMotionFuncTranspose,
      motionData,
      notes,
      reserved30,
      reserved108, 
    }
  }

  // Reserved (Bytes 1888-1915): Typically not used
  const reserved1888_1915 = []
  for (let i = 0;i < 27;i++) {
    reserved1888_1915[i] = bytes[i + 1888]
  }

  // Check the footer
  const footer = String.fromCharCode(bytes[1916], bytes[1917], bytes[1918], bytes[1919]);
  if (footer !== 'PTED') {
      throw new Error('Invalid footer');
  }

  return {
    numberOfSteps,
    programNumber,
    motionData,
    sequenceSettings,
    steps,
    reserved: {
      reserved4_5,
      reserved8,
      reserved10_11,
      reserved14,
      reserved74_79,
      reserved1888_1915
    }
  }
}

export const packSequenceData = ({
  numberOfSteps,
  programNumber,
  motionData,
  sequenceSettings,
  steps,
  reserved: {
    reserved4_5,
    reserved8,
    reserved10_11,
    reserved14,
    reserved74_79,
    reserved1888_1915
  }
}) => {
  // const numberOfSteps = steps.length
  const bytes = new Array(1919).fill(0)

  bytes[0] = 'P'.charCodeAt(0)
  bytes[1] = 'T'.charCodeAt(0)
  bytes[2] = 'S'.charCodeAt(0)
  bytes[3] = 'T'.charCodeAt(0)
  bytes[4] = reserved4_5[0]
  bytes[5] = reserved4_5[1]
  
  // Pack the step On/Off status
  for (let i = 0; i < numberOfSteps; i++) {
    const byteIndex = i < 8 ? 6 : 7
    const bitIndex = i % 8
    bytes[byteIndex] |= (steps[i].on & 1) << bitIndex
  }

  bytes[8] = reserved8
  bytes[9] = programNumber
  bytes[10] = reserved10_11[0]
  bytes[11] = reserved10_11[1]

  bytes[14] = reserved14
  bytes[15] = numberOfSteps

  // Pack the motion param values and on/off
  const { paramBytes, switchBytes } = packMotionData(motionData)
  paramBytes.forEach((value, i) => {
    bytes[16 + i] = value
  })
  switchBytes.forEach((value, i) => {
    bytes[42 + i] = value
  })

  // Pack the sequence settings
  const settingsBytes = packSettingsData(sequenceSettings)
  settingsBytes.forEach((value, i) => {
    bytes[68 + i] = value
  })

  for (let i = 0;i < 6;i++) {
    bytes[i + 74] = reserved74_79[i]
  }

  // Pack the step-specific bytes
  for (let i = 0; i < numberOfSteps; i++) {
    const step = steps[i]
    const byteIndex = i < 8 ? 12 : 13;
    const bitIndex = i % 8;
    const onOffByteIndex = i < 8 ? 6 : 7;
    bytes[byteIndex] |= (step.active & 1) << bitIndex
    bytes[onOffByteIndex] |= (step.on & 1) << bitIndex
    const stepDataOffset = 80 + i * 112;
    const { motionData, notes, reserved30, reserved108 } = step
    Array.from(packStepData({ motionData, notes, reserved30, reserved108 })).forEach((value, j) => {
      bytes[stepDataOffset + j] = value
    })
    bytes[1872 + i] = step.motionFuncTranspose & 1
  }

  for (let i = 0;i < 27;i++) {
    bytes[i + 1888] = reserved1888_1915[i]
  }

  // Pack the footer
  bytes[1916] = 'P'.charCodeAt(0)
  bytes[1917] = 'T'.charCodeAt(0)
  bytes[1918] = 'E'.charCodeAt(0)
  bytes[1919] = 'D'.charCodeAt(0)

  return bytes
}