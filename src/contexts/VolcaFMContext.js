import React, { useState, useEffect } from 'react'
import { bytesToHex, hexToBytes } from '../utils'
 /*
+---------+------------------------------------------------+
| Byte[H] |    Description                                 |
+---------+------------------------------------------------+
|   F0    | Exclusive Status                               |
|   7E    | Non Realtime Message                           |
|   nn    | MIDI Channel (Device ID)                       |
|   06    | General Information                            |
|   01    | Identity Request                               |
|   F7    | END OF EXCLUSIVE                               |
+---------+------------------------------------------------+
*/
const deviceInquiryRequest = [0x7e, 0x02, 0x06, 0x01]
/*
+---------+------------------------------------------------+
| Byte[H] |                Description                     |
+---------+------------------------------------------------+
|   F0    | Exclusive Status                               |
|   42    | KORG ID              ( Manufacturers ID )      |
|   50    | Search Device                                  |
|   00    | Request                                        |
|   dd    | Echo Back ID                                   |
|   F7    | END OF EXCLUSIVE                               |
+---------+------------------------------------------------
*/
const searchDeviceRequest = [0x50, 0x00, 0x77]
/*
+----------------+--------------------------------------------------+
|     Byte       |             Description                          |
+----------------+--------------------------------------------------+
| F0,42,3g,      | EXCLUSIVE HEADER                                 |
|    00,01,2F    |                                                  |
| 0001 0000 (10) | CURRENT SEQUENCE DATA DUMP REQUEST     10H       |
| 1111 0111 (F7) | EOX                                              |
+----------------+--------------------------------------------------+
*/
const currentSeqDumpRequest = [0x00, 0x01, 0x2F, 0x10]
/*
+----------------+--------------------------------------------------+
|     Byte       |             Description                          |
+----------------+--------------------------------------------------+
| F0,42,3g,      | EXCLUSIVE HEADER                                 |
|    00,01,2F    |                                                  |
| 0001 1100 (1C) | SEQUENCE DATA DUMP REQUEST             1CH       |
| 0000 ssss (1s) | SEQUENSE No (0 ~ 15)                             |
| 1111 0111 (F7) | EOX                                              |
+----------------+--------------------------------------------------+
*/
const seqDumpRequest = '0x00, 0x01, 0x2F, 0x1C, 0x10'

const exclusiveHeaderReply = [0x00, 0x01, 0x02F]

 const VolcaFMContext = React.createContext({
  initialise: () => {},
  currentChannel: null,
	setCurrentChannel: () => {},
	currentSequence: null,
	getSequence: () => {},
})

const UNKNOWN_MESSAGE = 'unknown-message'
const SEQUENCE_DUMP = 'sequence-dump'
const CURRENT_SEQUENCE_DUMP = 'current-sequence-dump'

const VolcaFMContextProvider = ({ children, channel, injectedWebMidiContext }) => {
  const {
		lastRxSysexMessage,
    sendSysexMessage,
  } = injectedWebMidiContext;

  const [currentChannel, _setCurrentChannel] = useState(channel)
  const [currentSequence, _setCurrentSequence] = useState([])
  
  const initialise = () => {
    console.log('VolcaFMContextProvider initialise')
  }

  const setCurrentChannel = (channel) => {
		if (channel >= 0 && channel < 16) {
			_setCurrentChannel(channel)
		}
	}

  useEffect(() => {
    parseSysexMessage(lastRxSysexMessage)
  }, [lastRxSysexMessage])

  const _channelHex = () => {
    return 0x30 | currentChannel
  }

  const getSequence = (number) => {
    const seqNumber = Number(number - 1).toString(16)
    const request = hexToBytes(seqDumpRequest.replace('s', seqNumber))
    sendSysexMessage([_channelHex()].concat(request))
  }

  const parseSysexMessage = (sysexMessage) => {
    // Check / remove 'header' 32 00 01 2f 4c
    const message = [...sysexMessage]
    const channel = message.shift() & 0x0f
    if(channel != currentChannel) {
      console.log(`Parse Error Channel ${channel} is not for us ${currentChannel}`)
      return
    }

    const byteStr = JSON.stringify(message.slice(0, 4))
    switch(byteStr) {
      case JSON.stringify([0, 1, 47, 76]):
        parseSequence(message.slice(4))
        break
      default:
        console.log('Cannot handle message ', byteStr)
    }
  }

  const parseSequence = (sequenceBytes) => {
    const sequenceNumber = sequenceBytes.shift()
    console.log('parseSequence ', sequenceNumber & 0xf)
    _setCurrentSequence(sequenceBytes)
    _parseSequenceData(sequenceBytes)
    setTimeout(() => {
      console.log('currentSequence is now ', currentSequence)
    }, 1000)
  }

  function _parseSequenceData(data) {
    // console.log('_parseSequenceData ', JSON.stringify(data))
    // Initialize an array to hold the step objects
    const steps = Array.from({ length: 16 }, () => ({}));

    // Check the header
    const header = String.fromCharCode(data[0], data[1], data[2], data[3], data[4]);
    if (header !== 'PPTST') {
        throw new Error(`Invalid header ${header}`);
    }

    // Parse the step On/Off status
    for (let i = 0; i < 16; i++) {
        const byteIndex = i < 8 ? 7 : 8;
        const bitIndex = i % 8;
        const stepOnOff = (data[byteIndex] >> bitIndex) & 1;
        steps[i].on = !!stepOnOff;
    }

    // Parse the step ACTIVE status
    for (let i = 0; i < 16; i++) {
        const byteIndex = i < 8 ? 13 : 14;
        const bitIndex = i % 8;
        const stepActive = (data[byteIndex] >> bitIndex) & 1;
        steps[i].active = !!stepActive;
    }

    // Parse the number of steps
    const numberOfSteps = data[16];

    console.log('numberOfSteps ', numberOfSteps)

    // Parse the motion parameters (TRANSPOSE, VELOCITY, etc.)
    const motionParams = [
        'transpose', 'velocity', 'algorithm', 'modulatorAttack', 'modulatorDecay',
        'carrierAttack', 'carrierDecay', 'lfoRate', 'lfoPitchDepth', 'arpType',
        'arpDiv', 'chorusDepth', 'reverbDepth'
    ];

    for (let i = 0; i < motionParams.length; i++) {
        const paramName = motionParams[i];
        const paramValue = (data[17 + 2 * i] << 8) | data[18 + 2 * i];
        steps.forEach(step => step[paramName] = paramValue);
    }

    // Parse the motion On/Off statuses
    for (let i = 0; i < motionParams.length; i++) {
        const paramName = `motion${motionParams[i][0].toUpperCase() + motionParams[i].slice(1)}On`;
        const byteIndex = 43 + 2 * i;
        const motionOn = data[byteIndex];
        steps.forEach(step => step[paramName] = !!motionOn);
    }

    // Parse the step-specific data
    for (let i = 0; i < 16; i++) {
        const stepDataOffset = 81 + i * 112;
        steps[i].data = Array.from(data.slice(stepDataOffset, stepDataOffset + 112));
    }

    // Parse the step MOTION FUNC TRANSPOSE Off/On status
    for (let i = 0; i < 16; i++) {
        const stepMotionFuncTranspose = (data[1873 + i]) & 1;
        steps[i].motionFuncTranspose = !!stepMotionFuncTranspose;
    }

    console.log('steps...', steps)
    console.log('data size', data.length)
    // Check the footer
    const footer = String.fromCharCode(data[1917], data[1918], data[1919], data[1920], data[1920]);
    if (footer !== 'PT\x00ED') {
        throw new Error(`Invalid footer '${footer}'`);
    }

    return steps;
  }

  const volcaFMContextValue = {
    initialise,
    currentChannel,
    setCurrentChannel,
    currentSequence,
	  getSequence,
  }
  
  return (
		<VolcaFMContext.Provider value={volcaFMContextValue}>
			{children}
		</VolcaFMContext.Provider>
	)
}

export default VolcaFMContext
export { VolcaFMContextProvider }