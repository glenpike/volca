import React, { useState, createContext } from 'react'
import { bytesToHex, hexToBytes } from '../utils/utils'
import { MidiContextType, SentSysexMessage } from '../types'

const testSysexMessage = hexToBytes('f0 42 30 00 01 2f 4c 00 50 50 54 53 54 68 4e 7f 63 7f 7f 09 02 4c 7f 7f 00 36 10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 20 00 00 00 00 00 08 05 00 01 06 67 1e 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 40 40 00 00 00 00 00 21 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 4c 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 13 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 4a 00 00 43 00 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 44 00 7f 00 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 4a 00 35 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 7f 00 10 00 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 7f 00 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 06 00 12 42 42 00 08 00 08 4c 5c 5e 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 08 3d 00 00 00 40 40 00 00 00 00 00 19 00 00 00 00 00 00 08 00 00 00 00 00 00 00 00 08 00 08 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1f 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 14 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 15 15 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 1d 08 4c 00 00 00 40 40 00 00 00 00 00 1a 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3d 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1e 00 00 00 00 00 00 08 00 00 09 00 06 41 42 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1d 00 00 00 00 00 00 08 00 00 47 00 43 00 00 00 08 00 08 4c 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3a 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 2e 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 1b 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 2b 43 00 00 35 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 38 00 00 00 00 00 00 00 00 00 00 00 00 00 31 08 4c 00 00 00 40 40 00 00 00 00 00 26 00 00 00 00 00 00 00 00 00 35 00 00 00 00 00 08 00 7f 7f 76 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 36 00 00 00 00 00 00 00 00 00 00 00 00 00 30 00 35 00 00 00 40 40 00 00 00 00 00 30 00 00 00 00 00 00 7f 00 10 7f 76 00 00 19 00 00 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 37 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 4c 00 00 00 40 40 00 00 00 00 00 17 00 00 00 00 00 00 08 00 00 4c 4c 4c 4c 08 08 08 00 08 4c 4c 4c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 41 52 00 43 54 49 43 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 50 54 00 45 44 f7')

const TestMidiContext = createContext<MidiContextType>({
  midiInitialised: false,
  currentOutput: null,
  currentInput: null,
  midiOutputs: null,
  midiInputs: null,
  lastTxSysexMessage: null,
  lastRxSysexMessage: null,
  initialise: () => { },
  setManufacturer: () => { },
  setCurrentOutput: () => { },
  setCurrentInput: () => { },
  getCurrentOutput: () => { },
  getCurrentInput: () => { },
  sendSysexMessage: () => { },
  sendUniversalMessage: () => { },
})


interface TestMidiContextProviderProps {
  children: React.ReactNode;
  manufacturer?: number;
}

const TestMidiContextProvider = ({ children, manufacturer }: TestMidiContextProviderProps) => {

  const [currentManufacturer, setManufacturer] = useState<number>(manufacturer || 0x42)
  const [currentOutput, _setCurrentOutput] = useState<null>(null)
  const [currentInput, _setCurrentInput] = useState<null>(null)
  const [midiOutputs, setMidiOutputs] = useState<[]>([])
  const [midiInputs, setMidiInputs] = useState<[]>([])
  const [lastTxSysexMessage, setTxSysexMessage] = useState<SentSysexMessage | null>(null)
  const [lastRxSysexMessage, setLastRxSysexMessage] = useState<Uint8Array | null>(null)
  const [midiInitialised, setMidiInitialised] = useState(false)

  const setCurrentOutput = (index: number | null) => {
    let output = null
    _setCurrentOutput(output)
  }

  const getCurrentOutput = (): null => {
    return null
  }

  const setCurrentInput = (index: number | null) => {
    let input = null
    _setCurrentInput(input)
  }

  const getCurrentInput = (): null => {
    return null
  }

  const sendSysexMessage = (data: Uint8Array) => {
    console.log(`TestMidiContext sending sysex message: ${bytesToHex(data)}`)
    setTxSysexMessage({ manufacturer: currentManufacturer, data })
    setTimeout(() => {
      const message: Array<number> = [...testSysexMessage]
      const firstByte = message.shift()
      const lastByte = message.pop()
      if (firstByte != 0xf0 && lastByte != 0xf2) {
        console.log('is not a valid Sysex message ', testSysexMessage)
        return
      }
      console.log('setLastRxSysexMessage ', bytesToHex(message))
      setLastRxSysexMessage(Uint8Array.from(message))
    }, 100)
  }

  const sendUniversalMessage = (_manufacturer: number, data: Uint8Array) => {
    sendSysexMessage(data)
  }

  const initialise = () => {
    setMidiInitialised(true)
  }

  const TestMidiContextValue = {
    midiInitialised,
    currentOutput,
    currentInput,
    midiOutputs,
    midiInputs,
    lastTxSysexMessage,
    lastRxSysexMessage,
    initialise,
    setManufacturer,
    setCurrentOutput,
    getCurrentOutput,
    setCurrentInput,
    getCurrentInput,
    sendSysexMessage,
    sendUniversalMessage,
  }

  return (
    <TestMidiContext.Provider value={TestMidiContextValue}>
      {children}
    </TestMidiContext.Provider>
  )
}

export default TestMidiContext
export { TestMidiContextProvider }