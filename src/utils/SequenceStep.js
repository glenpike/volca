//*note S9
const GATE_TIME_LOOKUP = [
  "0%", "1%", "3%", "4%", "6%", "7%", "8%", "10%",
  "11%", "13%", "14%", "15%", "17%", "18%", "19%", "21%",
  "22%", "24%", "25%", "26%", "28%", "29%", "31%", "32%",
  "33%", "35%", "36%", "38%", "39%", "40%", "42%", "43%",
  "44%", "46%", "47%", "49%", "50%", "51%", "53%", "54%",
  "56%", "57%", "58%", "60%", "61%", "63%", "64%", "65%",
  "67%", "68%", "69%", "71%", "72%", "74%", "75%", "76%",
  "78%", "79%", "81%", "82%", "83%", "85%", "86%", "88%",
  "89%", "90%", "92%", "93%", "94%", "96%", "97%", "99%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%",
  "100%", "100%", "100%", "100%", "100%", "100%", "100%", "TIE"
]

export const MOTION_PARAMS = [
  'transpose', 'velocity', 'algorithm', 'modulatorAttack', 'modulatorDecay',
  'carrierAttack', 'carrierDecay', 'lfoRate', 'lfoPitchDepth', 'arpType',
  'arpDiv', 'chorusDepth', 'reverbDepth'
];

class SequenceStep {
  fromBytes = (data) => {
    this.data = this._unpackStep(data)
    return this
  }

  toBytes = () => {
    const data = this._packStep(this.data)
    return data
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
  }

  /*
  *note S6 (STEP Data)
  +---------+-------+---------+---------------------------------------------+
  |  Offset |  Bit  |  Range  | Description                                 |
  +---------+-------+---------+---------------------------------------------+
  |   0~ 1  |       |  0~127  | Voice 1 Note No.                            |
  |   2~ 3  |       |  0~127  | Voice 2 Note No.                            |
  |   4~ 5  |       |  0~127  | Voice 3 Note No.                            |
  |   6~ 7  |       |  0~127  | Voice 4 Note No.                            |
  |   8~ 9  |       |  0~127  | Voice 5 Note No.                            |
  |  10~11  |       |  0~127  | Voice 6 Note No.                            |
  +---------+-------+---------+---------------------------------------------+
  |  12~17  |       |         | Reserved                                    |
  +---------+-------+---------+---------------------------------------------+
  |   18    |       |  0~127  | Voice 1 Velocity 0=No Note,1~127 = Velocity |
  |   19    |       |  0~127  | Voice 2 Velocity 0=No Note,1~127 = Velocity |
  |   20    |       |  0~127  | Voice 3 Velocity 0=No Note,1~127 = Velocity |
  |   21    |       |  0~127  | Voice 4 Velocity 0=No Note,1~127 = Velocity |
  |   22    |       |  0~127  | Voice 5 Velocity 0=No Note,1~127 = Velocity |
  |   23    |       |  0~127  | Voice 6 Velocity 0=No Note,1~127 = Velocity |
  +---------+-------+---------+---------------------------------------------+
  |   24    |       |         | Voice 1 Gate time                  *note S8 |
  |   25    |       |         | Voice 2 Gate time                  *note S8 |
  |   26    |       |         | Voice 3 Gate time                  *note S8 |
  |   27    |       |         | Voice 4 Gate time                  *note S8 |
  |   28    |       |         | Voice 5 Gate time                  *note S8 |
  |   29    |       |         | Voice 6 Gate time                  *note S8 |
  +---------+-------+---------+---------------------------------------------+
  |  30~31  |       |         | Reserved                                    |
  +---------+-------+---------+---------------------------------------------+
  |  32~42  |       |         | Reserved                                    |
  +---------+-------+---------+---------------------------------------------+
  |  43~ 47 |       |         |  MOTION Data (TRANSPOSE)          *note S10 |
  |  48~ 52 |       |         |  MOTION Data (VELOCITY)           *note S10 |
  |  53~ 57 |       |         |  MOTION Data (ALGORITHM)          *note S10 |
  |  58~ 62 |       |         |  MOTION Data (MODULATOR ATTACK)   *note S10 |
  |  63~ 67 |       |         |  MOTION Data (MODULATOR DECAY)    *note S10 |
  |  68~ 72 |       |         |  MOTION Data (CARRIER ATTACK)     *note S10 |
  |  73~ 77 |       |         |  MOTION Data (CARRIER DECAY)      *note S10 |
  |  78~ 82 |       |         |  MOTION Data (LFO RATE)           *note S10 |
  |  83~ 87 |       |         |  MOTION Data (LFO PITCH DEPTH)    *note S10 |
  |  88~ 92 |       |         |  MOTION Data (ARP TYPE)           *note S10 |
  |  93~ 97 |       |         |  MOTION Data (ARP DIV)            *note S10 |
  |  98~102 |       |         |  MOTION Data (CHORUS DEPTH)       *note S10 |
  | 103~107 |       |         |  MOTION Data (REVERB DEPTH)       *note S10 |
  +---------+-------+---------+---------------------------------------------+
  | 108~111 |       |         | Reserved                                    |
  +---------+-------+---------+---------------------------------------------+
    */
  _unpackStep = (data) => {
    if (data.length < 112) {
        throw new Error('Invalid MIDI step data length. Expected 112 bytes.');
    }

    // Initialize an object to store parsed values
    let step = {};

    step.voiceNoteNumbers = []
    step.voiceVelocities = []
    step.voiceGateTimes = []
    for(let i = 0;i < 6;i++) {
      step.voiceNoteNumbers.push([
        data[i * 2],
        data[(i * 2) + 1]
      ])
      step.voiceVelocities.push(data[i + 18])
      step.voiceGateTimes.push(this._unpackGateTime(data[24 + i]))
    }

    // Reserved (Bytes 30-42): Typically not used
    step.reserved30 = []
    for (let i = 0;i < 12;i++) {
      step.reserved30[i] = data[i + 30]
    }

    // Motion Data (Bytes 43-107)
    step.motionData = {}
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
        const paramName = MOTION_PARAMS[i];
        const paramValues = [];
        for(let j = 0;j < 5;j++) {
          paramValues.push(data[43 + (i * 5) + j])
        }
        step.motionData[paramName] = paramValues
    }

    // Reserved (Bytes 108-111): Typically not used, skipping
    step.reserved108 = []
    for (let i = 0;i < 4;i++) {
      step.reserved108[i] = data[i + 108]
    }

    return step;
  }

  _packStep = (step) => {
    const data = new Array(112).fill(0)

    for(let i = 0;i < 6;i++) {
      data[i * 2] = step.voiceNoteNumbers[i][0] & 0xFF
      data[(i * 2) + 1] = step.voiceNoteNumbers[i][1] & 0xFF
      data[i + 18] = step.voiceVelocities[i]
      data[24 + i] = this._packGateTime(step.voiceGateTimes[i])
    }
    // Reserved (Bytes 30-31): Typically not used
    for (let i = 0;i < 12;i++) {
      data[i + 30] = step.reserved30[i]
    }

    // Motion Data (Bytes 43-107)
    for (let i = 0; i < MOTION_PARAMS.length; i++) {
        const paramName = MOTION_PARAMS[i];
        const paramValues = step.motionData[paramName]
        for(let j = 0;j < 5;j++) {
          data[43 + (i * 5) + j] = paramValues[j]
        }
    }

    // Reserved (Bytes 108-111): Typically not used
    for (let i = 0;i < 4;i++) {
      data[i + 108] = step.reserved108[i]
    }
  
    return data
  }

  /*
  GATE TIME
  +-------+-------+---------+----------------------------------------------+
  | Offset|  Bit  |  Range  |  Description                                 |
  +-------+-------+---------+----------------------------------------------+
  |   0   |  0~6  |  0~127  | Gate Time                           *note S9 |
  |   0   |   7   |   0,1   | Trigger Switch Off/On             0,1=Off,On |
  +-------+-------+---------+----------------------------------------------+
  If the gate time is set to TIE(127) and the Trigger Switch for the next
  step is set to 0, the sound will continue into the next step.
  */
  _unpackGateTime = (byte) => {
   return {
      timeData: ( byte & 0x7F), 
      gateTime: GATE_TIME_LOOKUP[byte & 0x7F],
      trigger: ( byte & 0x80) !== 0
    }
  }

  _packGateTime = (time) => {
    return ((time.trigger & 1) << 7) | (GATE_TIME_LOOKUP.indexOf(time.gateTime) & 0x7F)
  }
}

export default SequenceStep