import React, { useState, useEffect, useCallback, createContext } from 'react'
import { bytesToHex, hexToBytes } from '../utils/utils'
import { convert7to8bit, convert8to7bit } from "../utils/MidiUtils"
import { parseSequenceBytes, packSequenceData } from '../utils/Volca/parseSequence'
import { useVolcaStore } from '../stores/useVolcaStore'

import { VolcaFMContextType, MidiContextType } from '../types'
import VolcaFMContextError from '../errors/VolcaFMContextError'
import { SequenceInfo } from '../types'

// const exclusiveHeaderReply = '0x00, 0x01, 0x02F' //unused
// const searchDeviceRequest = '0x50, 0x00, 0x77'
const deviceInquiryRequest = '0x0%{channel}, 0x06, 0x01'
const currentSeqDumpRequest = '0x00, 0x01, 0x2F, 0x10'
const seqDumpRequest = '0x00, 0x01, 0x2F, 0x1C, 0x0%{sequenceNumber}'
const sequenceSendRequest = '0x00, 0x01, 0x2F, 0x4C, 0x0%{sequenceNumber}'
// const currentSequenceSendRequest = '0x00, 0x01, 0x2F, 0x40'

const VolcaFMContext = createContext<VolcaFMContextType>(
  {
    deviceInquiry: () => { },
    currentChannel: 0,
    setCurrentChannel: (channel: number) => { },
    loadSequenceNumber: (sequenceNumber: number) => { },
    saveToSequenceNumber: (sequenceNumber: number) => { },
    loadCurrentSequence: () => { },
    webMidiContext: null,
  }
)

// const UNKNOWN_MESSAGE = 'unknown-message'
// const SEQUENCE_DUMP = 'sequence-dump'
// const CURRENT_SEQUENCE_DUMP = 'current-sequence-dump'

interface VolcaFMContextProviderProps {
  children: React.ReactNode;
  channel: number;
  injectedMidiContext: MidiContextType;
}

const VolcaFMContextProvider = ({ children, channel, injectedMidiContext }: VolcaFMContextProviderProps) => {
  const {
    lastRxSysexMessage,
    sendSysexMessage,
    sendUniversalMessage,
  } = injectedMidiContext;

  const getCurrentSequenceNumber = useVolcaStore(state => state.getCurrentSequenceNumber)
  const addOrUpdateSequence = useVolcaStore(state => state.addOrUpdateSequence);
  const getSequence = useVolcaStore(state => state.getSequence)

  const [currentChannel, _setCurrentChannel] = useState<number>(channel - 1)

  const deviceInquiry = () => {
    console.log('VolcaFMContextProvider deviceInquiry - sending deviceInquiryRequest')
    const request = hexToBytes(deviceInquiryRequest.replace('%{channel}', currentChannel.toString()))
    sendUniversalMessage(0x7e, Uint8Array.from(request))
  }

  const setCurrentChannel = (channel: number) => {
    if (channel >= 0 && channel < 16) {
      _setCurrentChannel(channel)
    }
  }

  const throwError = (message: string): never => {
    console.log(message)
    throw new VolcaFMContextError(message)
  }

  const _channelHex = () => {
    return 0x30 | currentChannel
  }

  const loadSequenceNumber = (number: number) => {
    const seqNumber = Number(number - 1).toString(16)
    const request = hexToBytes(seqDumpRequest.replace('%{sequenceNumber}', seqNumber))
    sendSysexMessage([_channelHex()].concat(request))
  }

  const loadCurrentSequence = () => {
    sendSysexMessage([_channelHex()].concat(hexToBytes(currentSeqDumpRequest)))
  }

  const saveToSequenceNumber = (number: number) => {
    const sequence: SequenceInfo | null = getSequence(Number(getCurrentSequenceNumber()))
    if (!sequence) {
      throwError(`No sequence loaded for ${number} to save`)
      return
    }

    const seqNumber = Number(number - 1).toString(16)
    const data = convert8to7bit(packSequenceData(sequence))
    const request = hexToBytes(sequenceSendRequest.replace('%{sequenceNumber}', seqNumber))
    const message = [_channelHex()].concat(request, data)
    console.log('saving sequence ', bytesToHex(message))
    sendSysexMessage(message)
  }

  const parseNumberedSequence = useCallback((sequenceBytes: number[]) => {
    const sequenceNumber = sequenceBytes.shift()
    console.log('parseNumberedSequence ', sequenceNumber)
    if (sequenceNumber === undefined) {
      throwError(`parseNumberedSequence Error Sequence Number is undefined`)
      return
    }
    const sequence = parseSequenceBytes(new Uint8Array(convert7to8bit(sequenceBytes)))

    addOrUpdateSequence(sequence, sequenceNumber)
  }, [addOrUpdateSequence])

  const parseCurrentSequence = useCallback((sequenceBytes: number[]) => {
    const sequence = parseSequenceBytes(new Uint8Array(convert7to8bit(sequenceBytes)))
    addOrUpdateSequence(sequence)
  }, [addOrUpdateSequence])

  const parseUniversalMessage = useCallback((sysexMessage: number[]) => {
    const [channelByte, ...message]: Array<number> = sysexMessage
    const channel = channelByte & 0x0f
    if (channelByte === undefined || channel !== currentChannel) {
      throwError(`parseUniversalMessage Error Channel ${channelByte} is not for us ${currentChannel}`)
    }

    const byteStr = JSON.stringify(message.slice(0, 4))
    switch (byteStr) {
      case JSON.stringify([6, 2, 66, 47]):
        console.log('Device Inquiry Reply ', bytesToHex(message))
        break
      default:
        console.log('Cannot handle message ', byteStr)
    }
  }, [currentChannel])

  const parseKorgMessage = useCallback((sysexMessage: number[]) => {
    const [channelByte, ...message]: Array<number> = sysexMessage
    const channel = channelByte & 0x0f
    if (channelByte === undefined || channel !== currentChannel) {
      throwError(`Parse Error Channel ${channelByte} is not for us ${currentChannel}`)
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
        throwError(`DATA LOAD ERROR ${message}`)
        break
      case JSON.stringify([0, 1, 47, 38]):
        throwError(`DATA FORMAT ERROR ${message}`)
        break
      default:
        throwError(`Cannot handle Korg Message type: ${byteStr}`)
    }
  }, [currentChannel, parseCurrentSequence, parseNumberedSequence])

  useEffect(() => {
    if (lastRxSysexMessage && lastRxSysexMessage.length > 1) {
      const [firstByte, ...sysexMessage]: Array<number> = Array.from(lastRxSysexMessage)
      if (firstByte === 0x42) {
        console.log('Korg message for us ', sysexMessage)
        parseKorgMessage(sysexMessage)
      } else if (firstByte === 0x7e) {
        parseUniversalMessage(sysexMessage)
      } else {
        throwError(`Unknown message for us ${bytesToHex(sysexMessage)}`)
      }
    }
  }, [lastRxSysexMessage, parseKorgMessage, parseUniversalMessage])


  const volcaFMContextValue = {
    deviceInquiry,
    currentChannel,
    setCurrentChannel,
    loadSequenceNumber,
    saveToSequenceNumber,
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