import React, { useState, useEffect } from 'react'
import { bytesToHex, hexToBytes } from '../utils/utils'
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

DEVICE INQUIRY REPLY
+---------+-----------------------------------------------+
| Byte[H] |                Description                    |
+---------+-----------------------------------------------+
|   F0    | Exclusive Status                              |
|   7E    | Non Realtime Message                          |
|   0g    | MIDI Global Channel  ( Device ID )            |
|   06    | General Information                           |
|   02    | Identity Reply                                |
|   42    | KORG ID              ( Manufacturers ID )     |
|   2F    | volca fm ID          ( Family ID   (LSB))     |
|   01    |                      ( Family ID   (MSB))     |
|   08    | 2nd generation ID    ( Member ID   (LSB))     |
|   00    |                      ( Member ID   (MSB))     |
|   xx    |                      ( Minor Ver.  (LSB))     |
|   xx    |                      ( Minor Ver.  (MSB))     |
|   xx    |                      ( Major Ver.  (LSB))     |
|   xx    |                      ( Major Ver.  (MSB))     |
|   F7    | END OF EXCLUSIVE                              |
+---------+-----------------------------------------------+
*/
const deviceInquiryRequest = '0x0c, 0x06, 0x01'

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
// const seqDumpRequest = '0x00, 0x01, 0x2F, 0x10'
const seqDumpRequest = '0x00, 0x01, 0x2F, 0x1C, 0x1s'

const exclusiveHeaderReply = [0x00, 0x01, 0x02F]//??

const sequenceSendRequest = '0x00, 0x01, 0x2F, 0x4C, 0x1s'
const currentSequenceSendRequest = [0x00, 0x01, 0x2F, 0x40]

 const VolcaFMContext = React.createContext({
  deviceInquiry: () => {},
  currentChannel: null,
	setCurrentChannel: () => {},
	currentSequenceNumber: null,
  saveCurrentSequence: () => {},
  loadCurrentSequence: () => {},
  loadSequenceNumber: () => {},
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
    sendUniversalMessage,
  } = injectedMidiContext;

  const [currentChannel, _setCurrentChannel] = useState(channel - 1)
  const [currentSequenceNumber, _setCurrentSequenceNumber] = useState(1)
  const [currentSequence, _setCurrentSequence] = useState([])
  
  const deviceInquiry = () => {
    console.log('VolcaFMContextProvider deviceInquiry - sending deviceInquiryRequest')
    const request = hexToBytes(deviceInquiryRequest.replace('c', currentChannel))
    sendUniversalMessage(0x7e, request)
  }

  const setCurrentChannel = (channel) => {
		if (channel >= 0 && channel < 16) {
			_setCurrentChannel(channel)
		}
	}

  useEffect(() => {
    if(lastRxSysexMessage && lastRxSysexMessage.length) {
      const firstByte = lastRxSysexMessage.shift()
      if(firstByte == 0x42) {
        console.log('Korg message for us ', lastRxSysexMessage)
        parseKorgMessage(lastRxSysexMessage)
      } else if(firstByte == 0x7e) {
        parseUniversalMessage(lastRxSysexMessage)
      } else {
        console.log('Unknown message for us ', lastRxSysexMessage)
      }
    }
  }, [lastRxSysexMessage])

  const _channelHex = () => {
    return 0x30 | currentChannel
  }

  const loadSequenceNumber = (number) => {
    _setCurrentSequenceNumber(number)
    _setCurrentSequence([])
    const seqNumber = Number(number - 1).toString(16)
    const request = hexToBytes(seqDumpRequest.replace('s', seqNumber))
    sendSysexMessage([_channelHex()].concat(request))
  }

  const loadCurrentSequence = () => {
    _setCurrentSequenceNumber(-1)
    _setCurrentSequence([])
    sendSysexMessage([_channelHex()].concat(currentSeqDumpRequest))
  }

  const saveCurrentSequence = () => {
    const data = convert8to7bit(currentSequence.toBytes())
    const message = [_channelHex()].concat(currentSequenceSendRequest, data)
    console.log('saving current sequence ', bytesToHex(message))
    sendSysexMessage(message)
  }

  const parseUniversalMessage = (sysexMessage) => {
    const message = [...sysexMessage]
    const channel = message.shift() & 0x0f
    if(channel != currentChannel) {
      console.log(`parseUniversalMessage Error Channel ${channel} is not for us ${currentChannel}`)
      return
    }

    const byteStr = JSON.stringify(message.slice(0, 4))
    switch(byteStr) {
      case JSON.stringify([6, 2, 66, 47]):
        console.log('Device Inquiry Reply ', bytesToHex(message))
        break
      default:
        console.log('Cannot handle message ', byteStr)
    }
  }

  const parseKorgMessage = (sysexMessage) => {
    const message = [...sysexMessage]
    const channel = message.shift() & 0x0f
    if(channel != currentChannel) {
      console.log(`Parse Error Channel ${channel} is not for us ${currentChannel}`)
      return
    }

    // Refactor this to be better
    const byteStr = JSON.stringify(message.slice(0, 4))
    switch(byteStr) {
      case JSON.stringify([0, 1, 47, 76]):
        console.log('Parsing Sequence ')
        parseNumberedSequence(message.slice(4))
        break
      case JSON.stringify([0, 1, 47, 64]):
        console.log('Parsing Current Sequence ')
        parseCurrentSequence(message.slice(4))
        break
      case JSON.stringify([0,1,47,35]):
        console.log('DATA LOAD COMPLETED')
        break
      case JSON.stringify([0,1,47,36]):
        console.log('DATA LOAD ERROR')
        break
      case JSON.stringify([0,1,47,38]):
        console.log('DATA FORMAT ERROR')
        break
      default:
        console.log('Cannot handle message ', byteStr)
    }
  }

  const parseNumberedSequence = (sequenceBytes) => {
    const sequenceNumber = sequenceBytes.shift()
    const sequence = new VolcaSequence(sequenceNumber)
    sequence.fromBytes(convert7to8bit(sequenceBytes))
    _setCurrentSequence(sequence)
    setTimeout(() => {
      console.log('currentSequence is now ', currentSequence)
    }, 1000)
  }
  
  const parseCurrentSequence = (sequenceBytes) => {
    const sequence = new VolcaSequence(-1)
    sequence.fromBytes(convert7to8bit(sequenceBytes))
    _setCurrentSequence(sequence)
    setTimeout(() => {
      console.log('currentSequence is now ', currentSequence)
    }, 1000)
  }

  const volcaFMContextValue = {
    deviceInquiry,
    currentChannel,
    setCurrentChannel,
    currentSequence,
    currentSequenceNumber,
    loadSequenceNumber,
    saveCurrentSequence,
    loadCurrentSequence,
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