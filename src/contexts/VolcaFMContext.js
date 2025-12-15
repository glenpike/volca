import React, { useState, useEffect } from 'react'
import { bytesToHex, hexToBytes } from '../utils/utils'
import { convert7to8bit, convert8to7bit } from "../utils/MidiUtils"
import { parseSequenceBytes } from '../utils/Volca/parseSequence'
import { useVolcaStore } from '../stores/useVolcaStore'
import { shallow } from 'zustand/shallow'

const deviceInquiryRequest = '0x0c, 0x06, 0x01'

const searchDeviceRequest = [0x50, 0x00, 0x77]

const currentSeqDumpRequest = [0x00, 0x01, 0x2F, 0x10]
const seqDumpRequest = '0x00, 0x01, 0x2F, 0x1C, 0x0s'

const exclusiveHeaderReply = [0x00, 0x01, 0x02F]//??

const sequenceSendRequest = '0x00, 0x01, 0x2F, 0x4C, 0x0s'
const currentSequenceSendRequest = [0x00, 0x01, 0x2F, 0x40]

const VolcaFMContext = React.createContext(
  {
    deviceInquiry: () => { },
    currentChannel: null,
    setCurrentChannel: () => { },
    loadSequenceNumber: (n) => { },
    saveSequenceNumber: (n) => { },
    loadCurrentSequence: () => { },
    webMidiContext: null,
  }
)

const UNKNOWN_MESSAGE = 'unknown-message'
const SEQUENCE_DUMP = 'sequence-dump'
const CURRENT_SEQUENCE_DUMP = 'current-sequence-dump'

const VolcaFMContextProvider = ({ children, channel, injectedMidiContext }) => {
  const {
    lastRxSysexMessage,
    sendSysexMessage,
    sendUniversalMessage,
  } = injectedMidiContext;

  // Throws errors in testing
  // const { setCurrentSequenceNumber, addOrUpdateSequence } = useVolcaStore(
  //   (state) => ({
  //     setCurrentSequenceNumber: state.setCurrentSequenceNumber,
  //     addOrUpdateSequence: state.addOrUpdateSequence,
  //   }),
  //   shallow
  // )
  const setCurrentSequenceNumber = useVolcaStore((state) => state.setCurrentSequenceNumber);
  const addOrUpdateSequence = useVolcaStore((state) => state.addOrUpdateSequence);
  const getSequence = useVolcaStore(state => state.getSequence)

  const [currentChannel, _setCurrentChannel] = useState(channel - 1)

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
    if (lastRxSysexMessage && lastRxSysexMessage.length) {
      const [firstByte, ...sysexMessage] = lastRxSysexMessage
      if (firstByte == 0x42) {
        console.log('Korg message for us ', sysexMessage)
        parseKorgMessage(sysexMessage)
      } else if (firstByte == 0x7e) {
        parseUniversalMessage(sysexMessage)
      } else {
        console.log('Unknown message for us ', bytesToHex(sysexMessage))
      }
    }
  }, [lastRxSysexMessage])

  const _channelHex = () => {
    return 0x30 | currentChannel
  }

  const loadSequenceNumber = (number) => {
    setCurrentSequenceNumber(-1)
    const seqNumber = Number(number - 1).toString(16)
    const request = hexToBytes(seqDumpRequest.replace('s', seqNumber))
    sendSysexMessage([_channelHex()].concat(request))
  }

  const loadCurrentSequence = () => {
    setCurrentSequenceNumber(-1)
    sendSysexMessage([_channelHex()].concat(currentSeqDumpRequest))
  }

  // Do we want to do this?
  // The current sequence on Volca is not the same as the current sequence in the store
  // const saveCurrentSequence = () => {
  //   const currentSequence = useVolcaStore(state => state.sequences.find((seq) => seq.programNumber === currentSequenceNumber))
  //   if(!currentSequence) {
  //     console.log('No current sequence to save')
  //     return
  //   }
  //   const data = convert8to7bit(currentSequence.toBytes())
  //   const message = [_channelHex()].concat(currentSequenceSendRequest, data)
  //   console.log('saving current sequence ', bytesToHex(message))
  //   sendSysexMessage(message)
  // }

  const saveSequenceNumber = (number) => {
    //Get it from the store!!!
    const sequence = getSequence(number)
    if (!sequence) {
      console.log(`No sequence ${number} to save`)
      return
    }

    const seqNumber = Number(number - 1).toString(16)
    const data = convert8to7bit(sequence.toBytes())
    const request = hexToBytes(sequenceSendRequest.replace('s', seqNumber))
    const message = [_channelHex()].concat(request, data)
    console.log('saving sequence ', bytesToHex(message))
    sendSysexMessage(message)
  }

  const parseUniversalMessage = (sysexMessage) => {
    const message = [...sysexMessage]
    const channel = message.shift() & 0x0f
    if (channel != currentChannel) {
      console.log(`parseUniversalMessage Error Channel ${channel} is not for us ${currentChannel}`)
      return
    }

    const byteStr = JSON.stringify(message.slice(0, 4))
    switch (byteStr) {
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
    if (channel != currentChannel) {
      console.log(`Parse Error Channel ${channel} is not for us ${currentChannel}`)
      return
    }

    // Refactor this to be better
    const byteStr = JSON.stringify(message.slice(0, 4))
    switch (byteStr) {
      case JSON.stringify([0, 1, 47, 76]):
        console.log('Parsing Sequence ')
        parseNumberedSequence(message.slice(4))
        break
      case JSON.stringify([0, 1, 47, 64]):
        console.log('Parsing Current Sequence ')
        parseCurrentSequence(message.slice(4))
        break
      case JSON.stringify([0, 1, 47, 35]):
        console.log('DATA LOAD COMPLETED')
        break
      case JSON.stringify([0, 1, 47, 36]):
        console.log('DATA LOAD ERROR')
        break
      case JSON.stringify([0, 1, 47, 38]):
        console.log('DATA FORMAT ERROR')
        break
      default:
        console.log('Cannot handle message ', byteStr)
    }
  }

  const parseNumberedSequence = (sequenceBytes) => {
    const sequenceNumber = sequenceBytes.shift()
    console.log('parseNumberedSequence ', sequenceNumber)
    const sequence = parseSequenceBytes(convert7to8bit(sequenceBytes))

    addOrUpdateSequence(sequence)
    setCurrentSequenceNumber(sequence.programNumber)
  }

  const parseCurrentSequence = (sequenceBytes) => {
    const sequence = parseSequenceBytes(convert7to8bit(sequenceBytes))
    addOrUpdateSequence(sequence)
    setCurrentSequenceNumber(sequence.programNumber)
  }

  const volcaFMContextValue = {
    deviceInquiry,
    currentChannel,
    setCurrentChannel,
    loadSequenceNumber,
    saveSequenceNumber,
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