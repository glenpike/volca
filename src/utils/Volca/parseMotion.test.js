import { packMotionData, parseMotionBytes } from './parseMotion';
import { motionParamBytes, motionSwitchBytes } from '../../../test/sequenceBytes';
import { motionData } from '../../../test/sequenceObjects';

describe('Motion', () => {
  test('should unpack motion from bytes', () => {

    const { motion, switches } = parseMotionBytes(motionParamBytes, motionSwitchBytes);

    expect(motion).toEqual(motionData.motion);
    expect(switches).toEqual(motionData.switches);
  });

  test('should pack motion to bytes', () => {
    const { paramBytes, switchBytes } = packMotionData(motionData);
    expect(paramBytes).toEqual(Uint8Array.from(motionParamBytes));
    expect(switchBytes).toEqual(Uint8Array.from(motionSwitchBytes));
  });


});