import React, { useState } from 'react'
// import MidiSelect from './components/MidiSelect/MidiSelect.js'
// import MessageDisplay from './components/MessageDisplay/MessageDisplay.js'
// import DataInput from './components/DataInput/DataInput.js'
import SequenceDebug from './components/SequenceDebug/SequenceDebug.js'
import { VolcaFMContextProvider } from './contexts/VolcaFMContext.js'
import { bytesToHex, hexToBytes } from './utils.js'

const testSysexMessage = hexToBytes('f0 42 32 00 01 2f 4c 00 50 50 54 53 54 68 4e 7f 63 7f 7f 09 02 4c 7f 7f 00 36 10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 20 00 00 00 00 00 08 05 00 01 06 67 1e 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 40 40 00 00 00 00 00 21 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 4c 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 13 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 4a 00 00 43 00 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 44 00 7f 00 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 4a 00 35 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 7f 00 10 00 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 7f 00 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 06 00 12 42 42 00 08 00 08 4c 5c 5e 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 08 3d 00 00 00 40 40 00 00 00 00 00 19 00 00 00 00 00 00 08 00 00 00 00 00 00 00 00 08 00 08 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1f 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 14 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 15 15 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 1d 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3d 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 08 00 00 09 00 06 41 42 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1d 00 00 00 00 00 00 08 00 00 47 00 43 00 00 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3a 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 2e 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1b 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 2b 43 00 00 35 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 38 00 00 00 00 00 00 00 00 00 00 00 00 00 31 08 4c 00 00 00 40 40 00 00 00 00 00 26 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 08 00 7f 7f 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 30 00 35 00 00 00 40 40 00 00 00 00 00 30 00 00 00 00 00 00 7f 00 10 7f 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 37 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 17 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 41 52 00 43 54 49 43 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 50 54 00 45 44 f7')
const currentSequenceSysex = hexToBytes('f0 42 32 00 01 2f 40 50 50 54 53 54 68 4e 7f 63 7f 7f 09 02 4c 7f 7f 00 36 10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 20 00 00 00 00 00 08 05 00 01 06 67 1e 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 40 40 00 00 00 00 00 21 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 4c 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 13 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 4a 00 00 43 00 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 44 00 7f 00 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 4a 00 35 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 7f 00 10 00 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 7f 00 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 06 00 12 42 42 00 08 00 08 4c 5c 5e 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 08 3d 00 00 00 40 40 00 00 00 00 00 19 00 00 00 00 00 00 08 00 00 00 00 00 00 00 00 08 00 08 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1f 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 14 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 15 15 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 1d 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3d 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 08 00 00 09 00 06 41 42 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1d 00 00 00 00 00 00 08 00 00 47 00 43 00 00 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3a 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 2e 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1b 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 2b 43 00 00 35 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 38 00 00 00 00 00 00 00 00 00 00 00 00 00 31 08 4c 00 00 00 40 40 00 00 00 00 00 26 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 08 00 7f 7f 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 30 00 35 00 00 00 40 40 00 00 00 00 00 30 00 00 00 00 00 00 7f 00 10 7f 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 37 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 17 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 41 52 00 43 54 49 43 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 50 54 00 45 44 f7')

const Wrapper = () => {

  const [lastRxSysexMessage, setLastRxSysexMessage] = useState([])

  const sendSysexMessage = (data) => {
    console.log(`sending sysex message: ${bytesToHex(data)}`)
    setTimeout(() => {
      const message = [...testSysexMessage]
      const firstByte = message.shift()
      const lastByte = message.pop()
      if(firstByte != 0xf0 && lastByte != 0xf2) {
        console.log('is not a valid Sysex message ', testSysexMessage)
        return
      }
      const manufacturer = message.shift()
      if(manufacturer != 0x42) {
        console.log('is not from Korg device ', testSysexMessage)
        return
      }
      setLastRxSysexMessage(message)
    }, 100)
  }

  const injectedWebMidiContext = {
    lastRxSysexMessage,
    sendSysexMessage,
  }

  
	return(
		<React.Fragment>
      {/* <header className="App-header">
      <div className="control__bar">
        <h1 className="control__heading"> Midi Sysex Controls </h1>
        <MidiSelect />
      </div>
      </header> */}
      <main>
      <div className="control__layout">
        <VolcaFMContextProvider channel={2} injectedWebMidiContext={injectedWebMidiContext}>
          <SequenceDebug/>
        </VolcaFMContextProvider>
        {/* <MessageDisplay/> */}
      </div>
      </main>
		</React.Fragment>
	)
}

export default Wrapper
