import React, { useState } from 'react'
import { WebMidi } from 'webmidi'
import { bytesToHex, checkSum } from '../utils.js'

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

const WebMidiContextProvider = ({ children, manufacturer }) => {
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
        console.log(`sysex: ${e}`);
				// Validate and remove f0 / f7 head/tail?
				// Validate manufacturer and remove...?
        setRxSysexMessage(e)
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

	const makeSysexData = (address, value) => {
		// const deviceId = 0x10
		// const modelId = [0x00, 0x0b]
		// const sendCmd = 0x12
		// const fullAddress = [0x01, 0x00].concat(address)
		// const check = checkSum(fullAddress.concat(value))
		// const data = [].concat(
		// 	deviceId,
		// 	modelId,
		// 	sendCmd,
		// 	fullAddress,
		// 	value,
		// 	check
		// )
		// return data
    return value
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
