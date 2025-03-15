import { parseStepBytes, packStepData } from "./parseStep";
import { singleStepDataBytes } from "../../../test/sequenceBytes"
import { singleStep } from "../../../test/sequenceObjects"


describe('Step', () => {
  describe('parseStepBytes', () => {
    let step
    beforeEach(() => {
      step = parseStepBytes(singleStepDataBytes)
    })

    test('parses notes correctly', () => {
      for (let i = 0; i < 6; i++) {
        expect(step.notes[i].note).toEqual(singleStep.notes[i].note)
        expect(step.notes[i].velocity).toBe(singleStep.notes[i].velocity)
        expect(step.notes[i].gateTime).toBe(singleStep.notes[i].gateTime)
        expect(step.notes[i].trigger).toBe(singleStep.notes[i].trigger)
      }
    })
  
    test('parses reserved30 correctly', () => {
      expect(step.reserved30).toEqual(singleStep.reserved30)
    })

    test('parses motionData correctly', () => {
      for (const paramName in singleStep.motionData) {
        expect(step.motionData[paramName]).toEqual(singleStep.motionData[paramName])
      }
    })

    test('parses reserved108 correctly', () => {
      expect(step.reserved108).toEqual(singleStep.reserved108)
    })
  })
  describe('packStepData', () => {
    let bytes
    beforeEach(() => {
      bytes = packStepData(singleStep)
    })
    
    test('packs notes correctly', () => {
      for (let i = 0; i < 6; i++) {
        expect(bytes[i * 2]).toBe(singleStepDataBytes[i * 2])
        expect(bytes[(i * 2) + 1]).toBe(singleStepDataBytes[(i * 2) + 1])
        expect(bytes[i + 18]).toBe(singleStepDataBytes[i + 18])
        expect(bytes[24 + i]).toBe(singleStepDataBytes[24 + i])
      }
    })

    test('packs reserved30 correctly', () => {
      for (let i = 0; i < 12; i++) {
        expect(bytes[i + 30]).toBe(singleStepDataBytes[i + 30])
      }
    })

    test('packs motionData correctly', () => {
      for (let i = 0; i < 65; i++) {
        expect(bytes[43 + i]).toBe(singleStepDataBytes[43 + i])
      }
    })

    test('packs reserved108 correctly', () => {
      for (let i = 0; i < 4; i++) {
        expect(bytes[i + 108]).toBe(singleStepDataBytes[i + 108])
      }
    })
  })
})