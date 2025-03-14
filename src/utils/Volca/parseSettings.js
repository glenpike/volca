const MOTION_SWITCHES = ['onOff', 'smooth', 'warpActiveStep', 'tempo1', 'tempo', 'voiceMono', 'voiceUnison', 'chorus']
const TOGGLES = ['arp', 'transposeNote', 'reverb']
const ARP_TYPE = ['OFF', 'RISE 1', 'RISE 2', 'RISE 3', 'FALL 1', 'FALL 2', 'FALL 3', 'RAND 1', 'RAND 2', 'RAND 3']
const ARP_DIV = [
  '1/12 STEP', '1/8 STEP', '1/4 STEP', '1/3 STEP', '1/2 STEP', 
  '2/3 STEP', '1/1 STEP', '3/2 STEP', '2/1 STEP', '3/1 STEP', 
  '4/1 STEP'
]
const TEMPO = ['1/1', '1/2', '1/4']

/*
  +-----------+-------+---------+--------------------------------------------------+
|     68    |   0   |   0,1   |  FUNC MOTION Off/On                   0,1=Off,On |
|     68    |   1   |   0,1   |  FUNC MOTION SMOOTH Off/On            0,1=Off,On |
|     68    |   2   |   0,1   |  FUNC WARP ACTIVE STEP Off/On         0,1=Off,On |
|     68    |  3~4  |   0~2   |  FUNC TEMPO                      0~2=1/1,1/2,1/4 |
|     68    |   5   |   0,1   |  FUNC VOICE MODE MONO Off/On          0,1=Off,On |
|     68    |   6   |   0,1   |  FUNC VOICE MODE UNISON Off/On        0,1=Off,On |
|     68    |   7   |   0,1   |  FUNC CHORUS Off/On                   0,1=Off,On |
+-----------+-------+---------+--------------------------------------------------+
|     69    |   0   |   0,1   |  FUNC ARP Off/On                      0,1=Off,On |
|     69    |   1   |   0,1   |  FUNC TRANSPOSE NOTE Off/On           0,1=Off,On |
|     69    |   2   |   0,1   |  FUNC REVERB Off/On                   0,1=Off,On |
|     69    |  3~7  |         |  Reserved                                        |
+-----------+-------+---------+--------------------------------------------------+
|     70    |       |   0~9   |  ARP TYPE                               *note S4 |
|     71    |       |   0~10  |  ARP DIV                                *note S5 |
+-----------+-------+---------+--------------------------------------------------+
|     72    |       |  0~127  |  CHORUS DEPTH                                    |
|     73    |       |  0~127  |  REVERB DEPTH                                    |
+-----------+-------+---------+--------------------------------------------------+
*/
export const packSettingsData = (data) => {
  const settingsBytes = new Array(6).fill(0)

  settingsBytes[0] = 0
  for (let i = 0; i < MOTION_SWITCHES.length; i++) {
    if(i === 3) {
      continue
    } else if(i === 4) {
      settingsBytes[0] |= (TEMPO.indexOf(data.motionSwitches.tempo) & 3) << 3
    } else {
      settingsBytes[0] |= (data.motionSwitches[MOTION_SWITCHES[i]] & 1) << i
    }
  }

  settingsBytes[1] = 0
  for (let i = 0; i < TOGGLES.length; i++) {
    settingsBytes[1] |= (data.toggleSwitches[TOGGLES[i]] & 1) << i
  }
  
  settingsBytes[2] = ARP_TYPE.indexOf(data.arpType)
  settingsBytes[3] = ARP_DIV.indexOf(data.arpDiv)
  settingsBytes[4] = data.chorusDepth
  settingsBytes[5] = data.reverbDepth
  return settingsBytes
}

export const parseSettingsBytes = (settingsBytes) => {
  data = {}
  data.motionSwitches = {}
  const states = settingsBytes[0]
  for (let i = 0; i < MOTION_SWITCHES.length; i++) {
    let switchVal = !!(states & (1 << i))
    if(i === 3) {
      continue
    } else if(i === 4) {
      switchVal = TEMPO[(states & (1 << 3)) >> 3 | (states & (1 << 4)) >> 3]
    }
    data.motionSwitches[MOTION_SWITCHES[i]] = switchVal
  }

  // data[69] is toggles for some things
  data.toggleSwitches = {}
  for (let i = 0; i < TOGGLES.length; i++) {
    data.toggleSwitches[TOGGLES[i]] = !!(settingsBytes[1] & (1 << i))
  }

  data.arpType = ARP_TYPE[settingsBytes[2]]
  data.arpDiv = ARP_DIV[settingsBytes[3]]
  data.chorusDepth = settingsBytes[4]
  data.reverbDepth = settingsBytes[5]

  return data
}