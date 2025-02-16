import Step from "./Step";
import { singleStepDataBytes } from "../../../../test/sequenceBytes"
import { singleStep } from "../../../../test/sequenceObjects"

describe('Step', () => {
  test('Converts from bytes correctly', () => {
    const step = new Step()
    step.fromBytes(singleStepDataBytes)
    expect(JSON.stringify(step.data)).toEqual(JSON.stringify(singleStep.data))
  });
  
  test('Converts to bytes correctly', () => {
    const step = new Step()
    step.data = {...singleStep.data}
    expect(step.toBytes()).toEqual(singleStepDataBytes)
  });
  
  test('toJSON', () => {
    const on = true
    const active = false
    const motionFuncTranspose = false
    const step = new Step({ on, active, motionFuncTranspose})
    step.fromBytes(singleStepDataBytes)
    const json = JSON.stringify({
      on,
      active,
      motionFuncTranspose,
      data: {...singleStep.data}
    })
    expect(step.toJSON()).toEqual(json)
  });
})
