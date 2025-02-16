const MOTION_SWITCHES = ['onOff', 'smooth', 'warpActiveStep', 'tempo1', 'tempo', 'voiceMono', 'voiceUnison', 'chorus']
const TOGGLES = ['arp', 'transposeNote', 'reverb']
const ARP_TYPE = ['OFF', 'RISE 1', 'RISE 2', 'RISE 3', 'FALL 1', 'FALL 2', 'FALL 3', 'RAND 1', 'RAND 2', 'RAND 3']
const ARP_DIV = [
  '1/12 STEP', '1/8 STEP', '1/4 STEP', '1/3 STEP', '1/2 STEP', 
  '2/3 STEP', '1/1 STEP', '3/2 STEP', '2/1 STEP', '3/1 STEP', 
  '4/1 STEP'
]
const TEMPO = ['1/1', '1/2', '1/4']

class Settings {
  fromBytes = (settingsBytes) => {
    this._unpackSettings(settingsBytes)
    return this
  }

  toBytes = () => {
    return this._packSettings()
  }

  toJSON = () => {
    return JSON.stringify(this._settings)
  }

  get settings() {
    return this._settings
  }

  set settings(settings) {
    this._settings = settings
  }
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
  _packSettings = () => {
    const settingsBytes = new Array(6).fill(0)

      
    settingsBytes[0] = 0
    for (let i = 0; i < MOTION_SWITCHES.length; i++) {
      if(i === 3) {
        continue
      } else if(i === 4) {
        settingsBytes[0] |= (TEMPO.indexOf(this._settings.motionSwitches.tempo) & 3) << 3
      } else {
        settingsBytes[0] |= (this._settings.motionSwitches[MOTION_SWITCHES[i]] & 1) << i
      }
    }

    settingsBytes[1] = 0
    for (let i = 0; i < TOGGLES.length; i++) {
      settingsBytes[1] |= (this._settings.toggleSwitches[TOGGLES[i]] & 1) << i
    }
    
    settingsBytes[2] = ARP_TYPE.indexOf(this._settings.arpType)
    settingsBytes[3] = ARP_DIV.indexOf(this._settings.arpDiv)
    settingsBytes[4] = this._settings.chorusDepth
    settingsBytes[5] = this._settings.reverbDepth
    return settingsBytes
  }

  _unpackSettings = (settingsBytes) => {
    this._settings = {}
    this._settings.motionSwitches = {}
    const states = settingsBytes[0]
    for (let i = 0; i < MOTION_SWITCHES.length; i++) {
      let switchVal = !!(states & (1 << i))
      if(i === 3) {
        continue
      } else if(i === 4) {
        switchVal = TEMPO[(states & (1 << 3)) >> 3 | (states & (1 << 4)) >> 3]
      }
      this._settings.motionSwitches[MOTION_SWITCHES[i]] = switchVal
    }


    // data[69] is toggles for some things
    this._settings.toggleSwitches = {}
    for (let i = 0; i < TOGGLES.length; i++) {
      this._settings.toggleSwitches[TOGGLES[i]] = !!(settingsBytes[1] & (1 << i))
    }

    this._settings.arpType = ARP_TYPE[settingsBytes[2]]
    this._settings.arpDiv = ARP_DIV[settingsBytes[3]]
    this._settings.chorusDepth = settingsBytes[4]
    this._settings.reverbDepth = settingsBytes[5]

    return this._settings
  }
}

export default Settings