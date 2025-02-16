import Motion, { MOTION_PARAMS } from './Motion';
import { motionParamBytes, motionSwitchBytes } from '../../../../test/sequenceBytes';
import { motionData } from '../../../../test/sequenceObjects';

describe('Motion', () => {
  let volcaMotion;

  beforeEach(() => {
    volcaMotion = new Motion();
  });

  test('should set and get motion', () => {
    const motion = { transpose: 100, velocity: 80 };
    volcaMotion.motion = motion;
    expect(volcaMotion.motion).toEqual(motion);
  });

  test('should set and get switches', () => {
    const switches = new Array(16).fill(1);
    volcaMotion.switches = switches;
    expect(volcaMotion.switches).toEqual(switches);
  });

  test('should pack motion to bytes', () => {
    volcaMotion.motion = motionData.motion;
    volcaMotion.switches = motionData.switches;
    const { paramBytes, switchBytes } = volcaMotion.toBytes();
    expect(paramBytes).toEqual(motionParamBytes);
    expect(switchBytes).toEqual(motionSwitchBytes);
  });

  test('should unpack motion from bytes', () => {
    const paramBytes = new Array(MOTION_PARAMS.length * 2).fill(0);
    const switchBytes = new Array(32).fill(0);
    const { motion, switches } = volcaMotion.fromBytes(paramBytes, switchBytes);
    expect(motion).toEqual(volcaMotion.motion);
    expect(switches).toEqual(volcaMotion.switches);
  });

  test('should convert to JSON', () => {
    const motion = { transpose: 100, velocity: 80 };
    const switches = new Array(16).fill(1);
    volcaMotion.motion = motion;
    volcaMotion.switches = switches;
    const json = volcaMotion.toJSON();
    expect(json).toEqual(JSON.stringify({ motion, switches }));
  });
});