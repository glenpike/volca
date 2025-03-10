import React, { useState, useEffect } from 'react'
import { hexToBytes } from '../utils/utils'
import { convert7to8bit, convert8to7bit } from "../utils/MidiUtils"
import VolcaSequence from '../utils/Volca/Sequence'
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
const seqDumpRequest = '0x00, 0x01, 0x2F, 0x1C, 0x1s'

const exclusiveHeaderReply = [0x00, 0x01, 0x02F]

 const VolcaFMContext = React.createContext({
  initialise: () => {},
  currentChannel: null,
	setCurrentChannel: () => {},
	currentSequenceNumber: null,
  setCurrentSequenceNumber: () => {},
	currentSequence: null,
  webMidiContext: null,
})

const UNKNOWN_MESSAGE = 'unknown-message'
const SEQUENCE_DUMP = 'sequence-dump'
const CURRENT_SEQUENCE_DUMP = 'current-sequence-dump'

const VolcaFMContextProvider = ({ children, channel, injectedMidiContext }) => {
  const {
		lastRxSysexMessage,
    sendSysexMessage,
  } = injectedMidiContext;

  const [currentChannel, _setCurrentChannel] = useState(channel - 1)
  const [currentSequenceNumber, _setCurrentSequenceNumber] = useState(1)
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
    if(lastRxSysexMessage && lastRxSysexMessage.length) {
      parseSysexMessage(lastRxSysexMessage)
    }
  }, [lastRxSysexMessage])

  const _channelHex = () => {
    return 0x30 | currentChannel
  }

  const setCurrentSequenceNumber = (number) => {
    _setCurrentSequenceNumber(number)
    _setCurrentSequence([])
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
    const sequence = new VolcaSequence(sequenceNumber)
    sequence.fromBytes(convert7to8bit(sequenceBytes))
    _setCurrentSequence(sequence)
    setTimeout(() => {
      console.log('currentSequence is now ', currentSequence)
    }, 1000)
  }

  const volcaFMContextValue = {
    initialise,
    currentChannel,
    setCurrentChannel,
    currentSequence,
    currentSequenceNumber,
    setCurrentSequenceNumber,
    webMidiContext: injectedMidiContext,
  }
  
  return (
		<VolcaFMContext.Provider value={volcaFMContextValue}>
			{children}
		</VolcaFMContext.Provider>
	)
}

export default VolcaFMContext
export { VolcaFMContextProvider }