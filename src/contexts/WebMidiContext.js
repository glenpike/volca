import React, { useState } from 'react'
import { bytesToHex } from '../utils/utils.js'

const sysexEnabled = true

const WebMidiContext = React.createContext({
	midiInitialised: false,
	currentOutput: null,
  currentInput: null,
	midiOutputs: null,
  midiInputs: null,
	lastTxSysexMessage: null,
  lastRxSysexMessage: null,
	initialise: () => {},
	setManufacturer: () => {},
	setCurrentOutput: () => {},
  setCurrentInput: () => {},
	getCurrentOutput: () => {},
  getCurrentInput: () => {},
	sendSysexMessage: () => {},
})

const WebMidiContextProvider = ({ children, manufacturer, WebMidi }) => {
	// console.log('WebMidi mocked?')
	const [currentManufacturer, setManufacturer] = useState(manufacturer || 0x42)
	const [currentOutput, _setCurrentOutput] = useState(null)
  const [currentInput, _setCurrentInput] = useState(null)
	const [midiOutputs, setMidiOutputs] = useState([])
  const [midiInputs, setMidiInputs] = useState([])

	const [midiInitialised, setMidiInitialised] = useState(false)

	const [lastTxSysexMessage, setTxSysexMessage] = useState(null)
  const [lastRxSysexMessage, setRxSysexMessage] = useState(null)
  const [currentListener, _setCurrentListener] = useState(null)

	const initialise = () => {
    console.log('WebMidiContextProvider initialise')
		WebMidi
			.enable({sysex: sysexEnabled})
      .then(() => {
        console.log("WebMidi with sysex enabled!")
        const outputsArray = []
        const inputsArray = []

        WebMidi.inputs.forEach(input => {
          console.log(input.manufacturer, input.name)
          inputsArray.push(input)
        })

        WebMidi.outputs.forEach(output => {
          console.log(output.manufacturer, output.name)
          outputsArray.push(output)
        })
        setCurrentOutput(null)
        setCurrentInput(null)
        setMidiOutputs(outputsArray)
        setMidiInputs(inputsArray)
        setMidiInitialised(true)
      })
      .catch(err => alert(err));

	}

	const setCurrentOutput = (index) => {
		let output = null
		if (index >= 0 && index < midiOutputs.length) {
			output = midiOutputs[index]
		}
		_setCurrentOutput(output)
	}

	const getCurrentOutput = () => {
		if (currentOutput) {
			return WebMidi.getOutputById(currentOutput.id)
		}
		return null
	}

  const setCurrentInput = (index) => {
    removeInputListener()
		let input = null
		if (index >= 0 && index < midiInputs.length) {
			input = midiInputs[index]
		}
		_setCurrentInput(input)

    addInputListener(input)
	}

  const removeInputListener = () => {
    if(currentInput) {
      WebMidi.getInputById(currentInput.id).removeListener(currentListener)
    }
  }

  const addInputListener = (input) => {
    if(input) {
      const listener = WebMidi.getInputById(input.id).addListener("sysex", e => {
        // console.log(`sysex:`, e);
				// Validate and remove f0 / f7 head/tail?
				// Validate manufacturer and remove...?
				const {data: message } = e
				const firstByte = message.shift()
				const lastByte = message.pop()
				if(firstByte != 0xf0 && lastByte != 0xf2) {
					console.log('is not a valid Sysex message ', firstByte, lastByte)
					return
				}
				const manufacturer = message.shift()
				if(manufacturer != 0x42) {
					console.log('is not from Korg device ', e)
					return
				}
				console.log('valid sysex message for us ', message)
        setRxSysexMessage(message)
      });
      _setCurrentListener(listener)
    }
  }

	const getCurrentInput = () => {
		if (currentInput) {
			return WebMidi.getInputById(currentInput.id)
		}
		return null
	}

	const sendSysexMessage = (data) => {
		const output = getCurrentOutput()
		if (output) {
			console.log(`sending sysex message: ${bytesToHex(data)}`)
			try {
				setTxSysexMessage({ currentManufacturer, data })
				output.sendSysex(currentManufacturer, data)
			} catch(RangeError) {
				console.log(`RangeError for: ${data}`)
			}
		}
	}

	const webMidiContextValue = {
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
	}

	return (
		<WebMidiContext.Provider value={webMidiContextValue}>
			{children}
		</WebMidiContext.Provider>
	)
}

export default WebMidiContext
export { WebMidiContextProvider }
