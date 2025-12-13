import {
  ByteArray,
  SequenceSettings,
  MotionSwitchNames,
  ToggleSwitchNames,
  ArpType,
  ArpDiv,
  Tempo,
  MOTION_SWITCH_NAMES,
  TOGGLE_SWITCH_NAMES,
  ARP_TYPES,
  ARP_DIVISIONS,
  TEMPO_VALUES,
} from '../../types'
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
export const packSettingsData = (data: SequenceSettings): ByteArray => {
  const settingsBytes = new Uint8Array(6)

  settingsBytes[0] = 0
  for (let i = 0; i < MOTION_SWITCH_NAMES.length; i++) {
    if (i === 3) {
      continue
    } else if (i === 4) {
      settingsBytes[0] |= (TEMPO_VALUES.indexOf(data.tempo) & 3) << 3
    } else {
      settingsBytes[0] |= (Number(data.motionSwitches[MOTION_SWITCH_NAMES[i]]) & 1) << i
    }
  }

  settingsBytes[1] = 0
  for (let i = 0; i < TOGGLE_SWITCH_NAMES.length; i++) {
    settingsBytes[1] |= (Number(data.toggleSwitches[TOGGLE_SWITCH_NAMES[i]]) & 1) << i
  }

  settingsBytes[2] = ARP_TYPES.indexOf(data.arpType)
  settingsBytes[3] = ARP_DIVISIONS.indexOf(data.arpDiv)
  settingsBytes[4] = data.chorusDepth
  settingsBytes[5] = data.reverbDepth
  return settingsBytes
}

export const parseSettingsBytes = (settingsBytes: ByteArray): SequenceSettings => {
  const data: SequenceSettings = {
    motionSwitches: {} as Record<MotionSwitchNames, boolean>,
    toggleSwitches: {} as Record<ToggleSwitchNames, boolean>,
    arpType: 'OFF' as ArpType,
    arpDiv: '1/1 STEP' as ArpDiv,
    tempo: '1/1' as Tempo,
    chorusDepth: 0,
    reverbDepth: 0,
  }

  const states = settingsBytes[0]
  for (let i = 0; i < MOTION_SWITCH_NAMES.length; i++) {
    let switchVal: boolean = !!(states & (1 << i))
    if (i === 4) {
      data.tempo = TEMPO_VALUES[((states & (1 << 3)) >> 3) | ((states & (1 << 4)) >> 3)]
    }
    data.motionSwitches[MOTION_SWITCH_NAMES[i]] = switchVal
  }

  for (let i = 0; i < TOGGLE_SWITCH_NAMES.length; i++) {
    data.toggleSwitches[TOGGLE_SWITCH_NAMES[i]] = !!(settingsBytes[1] & (1 << i))
  }

  data.arpType = ARP_TYPES[settingsBytes[2]]
  data.arpDiv = ARP_DIVISIONS[settingsBytes[3]]
  data.chorusDepth = settingsBytes[4]
  data.reverbDepth = settingsBytes[5]

  return data
}