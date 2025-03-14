import { packMotionData, parseMotionBytes, MOTION_PARAMS } from './parseMotion';
import { motionParamBytes, motionSwitchBytes } from '../../../test/sequenceBytes';
import { motionData } from '../../../test/sequenceObjects';

describe('Motion', () => {
  test('should pack motion to bytes', () => {
    const { motion, switches } = motionData;
    const { paramBytes, switchBytes } = packMotionData(motion, switches);
    expect(paramBytes).toEqual(motionParamBytes);
    expect(switchBytes).toEqual(motionSwitchBytes);
  });

  test.skip('should unpack motion from bytes', () => {
    // Need a data set!!
    const paramBytes = new Array(MOTION_PARAMS.length * 2).fill(0);
    const switchBytes = new Array(32).fill(0);
    const { motion, switches } = parseMotionBytes(paramBytes, switchBytes);
    
    // expect(motion).toEqual(volcaMotion.motion);
    // expect(switches).toEqual(volcaMotion.switches);
  });
});