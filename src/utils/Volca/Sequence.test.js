import VolcaSequence from "./Sequence";
import Step from "./Sequence/Step";
import sequenceObjects from "../../../test/sequenceObjects";
import { 
  unpackedData,
  motionParamBytes,
  motionSwitchBytes,
  sequenceSettingsBytes,
  singleStepDataBytes,
  stepDataSwitchBytes 
} from "../../../test/sequenceBytes";
import Motion from "./Sequence/Motion";
import Settings from "./Sequence/Settings";

describe('Sequence', () => {
  describe('fromBytes', () => {
    let sequence = new VolcaSequence(2)
    
    beforeEach(() => {
      sequence.fromBytes([...unpackedData])
    })

    test('Creates motion data correctly', () => {
      expect(sequence.motionData).toBeInstanceOf(Motion)
    })

    test('Creates number correctly', () => {
      expect(sequence.number).toEqual(2)
    })

    test('Creates program correctly', () => {
      expect(sequence.programNumber).toEqual(9)
    })

    test('Creates the correct number of steps', () => {
      expect(sequence.steps).toHaveLength(16)
    })

    test('Step has correct data', () => {
      const step = sequence.steps[0]
      expect(step).toBeInstanceOf(Step)
      expect(step.on).toEqual(true)
      expect(step.active).toEqual(true)
      expect(step.motionFuncTranspose).toEqual(false)
      expect(step.toBytes()).toEqual(singleStepDataBytes)
    })
  })

  describe('toBytes', () => {
    let sequence = new VolcaSequence()
    let motion = new Motion()
    let step = new Step({ on: true, active: true, motionFuncTranspose: false })
    let settings = new Settings()
    
    beforeEach(() => {
      jest.spyOn(motion, 'toBytes').mockReturnValue({ paramBytes: motionParamBytes, switchBytes: motionSwitchBytes })
      jest.spyOn(settings, 'toBytes').mockReturnValue(sequenceSettingsBytes)
      jest.spyOn(step, 'toBytes').mockReturnValue(singleStepDataBytes)

      sequence.number = sequenceObjects.number
      sequence.programNumber = sequenceObjects.programNumber
      sequence.motionData = motion
      sequence.sequenceSettings = settings

      sequence.steps = Array(16).fill(step)
      sequence.reserved = sequenceObjects.reserved
    })

    test('Packs the correct number of bytes', () => {
      expect(sequence.toBytes()).toHaveLength(1920)
    })

    test('Packs the correct header', () => {
      expect(sequence.toBytes().slice(0, 4)).toEqual(['P','T', 'S', 'T'].map(char => char.charCodeAt(0)))
    })

    test('Packs the correct reserved bytes', () => {
      expect(sequence.toBytes().slice(4, 6)).toEqual([232, 78])
    })

    test('Packs the step "on" data' , () => {
      expect(sequence.toBytes().slice(6, 8)).toEqual([0xFF, 0xFF])
    })

    test('Packs the active step data' , () => {
      expect(sequence.toBytes().slice(12, 14)).toEqual([0xFF, 0xFF])
    })

    test('Packs the correct number of steps' , () => {
      expect(sequence.toBytes()[15]).toEqual(16)
    })

    test('Packs the motion params', () => {
      expect(sequence.toBytes().slice(16, 42)).toEqual(motionParamBytes)
    })

    test('Packs the motion switches', () => {
      expect(sequence.toBytes().slice(42, 68)).toEqual(motionSwitchBytes)
    })

    test('Packs the sequence settings', () => {
      expect(sequence.toBytes().slice(68, 74)).toEqual(sequenceSettingsBytes)
    })

    test('Packs the step data', () => {
      expect(sequence.toBytes().slice(80, 192)).toEqual(singleStepDataBytes)
    })

    test('Packs the correct step motionFuncTranspose values' , () => {
      expect(sequence.toBytes().slice(1872, 1888)).toEqual(stepDataSwitchBytes)
    })
    test('Packs the correct footer' , () => {
      expect(sequence.toBytes().slice(1916, 1920)).toEqual(['P','T', 'E', 'D'].map(char => char.charCodeAt(0)))
    })
  })
})