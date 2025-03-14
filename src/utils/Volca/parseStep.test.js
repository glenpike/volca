import { parseStepBytes, packStepData } from "./parseStep";
import { singleStepDataBytes } from "../../../test/sequenceBytes"
import { singleStep } from "../../../test/sequenceObjects"

describe('Step', () => {
  test('Converts from bytes correctly', () => {
    const step = parseStepBytes(singleStepDataBytes)
    expect(JSON.stringify(step)).toEqual(JSON.stringify(singleStep.data))
  });
  
  test('Converts to bytes correctly', () => {
    expect(packStepData({...singleStep.data})).toEqual(singleStepDataBytes)
  });
})
