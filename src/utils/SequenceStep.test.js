import SequenceStep from "./SequenceStep";

const input = [54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 161, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const output = '{"voiceNoteNumbers":[[54,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"voiceVelocities":[64,0,0,0,0,0],"voiceGateTimes":[{"timeData":33,"gateTime":"46%","trigger":true},{"timeData":0,"gateTime":"0%","trigger":false},{"timeData":0,"gateTime":"0%","trigger":false},{"timeData":0,"gateTime":"0%","trigger":false},{"timeData":0,"gateTime":"0%","trigger":false},{"timeData":0,"gateTime":"0%","trigger":false}],"reserved30":[0,0,0,0,0,0,0,0,0,0,76,100],"motionData":{"transpose":[0,0,0,0,0],"velocity":[0,0,0,0,0],"algorithm":[0,0,0,0,0],"modulatorAttack":[0,0,0,0,0],"modulatorDecay":[0,0,0,0,0],"carrierAttack":[0,0,0,0,0],"carrierDecay":[0,0,0,0,0],"lfoRate":[0,0,0,0,0],"lfoPitchDepth":[0,0,0,0,0],"arpType":[0,0,0,0,0],"arpDiv":[0,0,0,0,0],"chorusDepth":[0,0,0,0,0],"reverbDepth":[0,0,0,0,0]},"reserved108":[0,0,0,0]}'

describe('SequenceStep', () => {
  test('Converts from bytes correctly', () => {
    const step = new SequenceStep().fromBytes(input)
    expect(JSON.stringify(step.data)).toEqual(output)
  });
  
  test('Converts to bytes correctly', () => {
    const step = new SequenceStep()
    step.data = JSON.parse(output)
    expect(step.toBytes()).toEqual(input)
  });  
})
