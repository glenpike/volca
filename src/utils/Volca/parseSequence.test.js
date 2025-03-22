import { motionData, sequenceSettings, singleStep, reserved } from "../../../test/sequenceObjects";
import { 
  unpackedData,
  motionParamBytes,
  motionSwitchBytes,
  sequenceSettingsBytes,
  singleStepDataBytes,
  stepDataSwitchBytes 
} from "../../../test/sequenceBytes";

import { parseSequenceBytes, packSequenceData } from "./parseSequence";

// TODO, it would be nice to mock the parse / pack funcs for step/motion/settings
// and just test the sequence functions here

describe('Sequences', () => {
  describe('parseSequenceBytes', () => {
    let sequence
    
    beforeEach(() => {
      sequence = parseSequenceBytes([...unpackedData])
    })

    test('Creates motion data correctly', () => {
      expect(sequence.motionData).toBeDefined
    })

    test('Creates settings data correctly', () => {
      expect(sequence.sequenceSettings).toBeDefined
    })

    test('Creates reserved data correctly', () => {
      expect(sequence.reserved).toBeDefined
    })

    test('Creates program correctly', () => {
      expect(sequence.programNumber).toEqual(9)
    })

    test('Creates the correct number of steps', () => {
      expect(sequence.steps).toHaveLength(16)
    })

    test('Step has correct data', () => {
      const step = sequence.steps[0]
      expect(step.on).toEqual(true)
      expect(step.active).toEqual(true)
      expect(step.motionFuncTranspose).toEqual(false)
    })
  })

  describe('packSequenceData', () => {
    let sequence
    
    beforeEach(() => {
      sequence = {
        numberOfSteps: 16,
        programNumber: 9,
        motionData,
        sequenceSettings,
        steps: Array(16).fill(singleStep),
        reserved
      }
    })

    test('Packs the correct number of bytes', () => {
      expect(packSequenceData(sequence)).toHaveLength(1920)
    })

    test('Packs the correct header', () => {
      expect(packSequenceData(sequence).slice(0, 4)).toEqual(['P','T', 'S', 'T'].map(char => char.charCodeAt(0)))
    })

    test('Packs the correct reserved bytes', () => {
      expect(packSequenceData(sequence).slice(4, 6)).toEqual([232, 78])
    })

    test('Packs the step "on" data' , () => {
      expect(packSequenceData(sequence).slice(6, 8)).toEqual([0x00, 0x00])
    })

    test('Packs the active step data' , () => {
      expect(packSequenceData(sequence).slice(12, 14)).toEqual([0xFF, 0xFF])
    })

    test('Packs the correct number of steps' , () => {
      const bytes = packSequenceData(sequence)
      expect(bytes[15]).toEqual(16)
    })

    test('Packs the motion params', () => {
      expect(packSequenceData(sequence).slice(16, 42)).toEqual(motionParamBytes)
    })

    test('Packs the motion switches', () => {
      expect(packSequenceData(sequence).slice(42, 68)).toEqual(motionSwitchBytes)
    })

    test('Packs the sequence settings', () => {
      expect(packSequenceData(sequence).slice(68, 74)).toEqual(sequenceSettingsBytes)
    })

    test('Packs the step data', () => {
      expect(packSequenceData(sequence).slice(80, 192)).toEqual(singleStepDataBytes)
    })

    test('Packs the correct step motionFuncTranspose values' , () => {
      expect(packSequenceData(sequence).slice(1872, 1888)).toEqual(stepDataSwitchBytes)
    })
    test('Packs the correct footer' , () => {
      expect(packSequenceData(sequence).slice(1916, 1920)).toEqual(['P','T', 'E', 'D'].map(char => char.charCodeAt(0)))
    })
  })
})