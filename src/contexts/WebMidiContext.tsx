import React, { useState, createContext } from 'react'
import { bytesToHex } from '../utils/utils'
import { MidiContextType, SentSysexMessage } from '../types'
import { Input, Output } from 'webmidi'

const sysexEnabled = true

const WebMidiContext = createContext<MidiContextType>({
	midiInitialised: false,
	currentOutput: null,
	currentInput: null,
	midiOutputs: [],
	midiInputs: [],
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

interface WebMidiContextProviderProps {
	children: React.ReactNode;
	manufacturer?: number;
	WebMidi: any; // or more specific WebMidi type
}

const WebMidiContextProvider = ({ children, manufacturer, WebMidi }: WebMidiContextProviderProps) => {
	// console.log('WebMidi mocked?')
	const [currentManufacturer, setManufacturer] = useState<number>(manufacturer || 0x42)
	const [currentOutput, _setCurrentOutput] = useState<Output | null>(null)
	const [currentInput, _setCurrentInput] = useState<Input | null>(null)
	const [midiOutputs, setMidiOutputs] = useState<Output[]>([])
	const [midiInputs, setMidiInputs] = useState<Input[]>([])

	const [midiInitialised, setMidiInitialised] = useState<boolean>(false)

	const [lastTxSysexMessage, setTxSysexMessage] = useState<SentSysexMessage | null>(null)
	const [lastRxSysexMessage, setRxSysexMessage] = useState<Uint8Array | null>(null)
	const [currentListener, _setCurrentListener] = useState(null)

	const initialise = () => {
		console.log('WebMidiContextProvider initialise')
		WebMidi
			.enable({ sysex: sysexEnabled })
			.then(() => {
				console.log("WebMidi with sysex enabled!")
				const outputsArray: Output[] = []
				const inputsArray: Input[] = []

				WebMidi.inputs.forEach((input: Input) => {
					// console.log(input.manufacturer, input.name)
					inputsArray.push(input)
				})

				WebMidi.outputs.forEach((output: Output) => {
					// console.log(output.manufacturer, output.name)
					outputsArray.push(output)
				})
				setCurrentOutput(null)
				setCurrentInput(null)
				setMidiOutputs(outputsArray)
				setMidiInputs(inputsArray)
				setMidiInitialised(true)
			})
			.catch((err: any) => alert(err));

	}

	const setCurrentOutput = (index: number | null) => {
		let output = null
		if (index && index >= 0 && index < midiOutputs.length) {
			output = midiOutputs[index]
		}
		_setCurrentOutput(output)
	}

	const getCurrentOutput = (): Output | null => {
		if (currentOutput) {
			return WebMidi.getOutputById(currentOutput.id)
		}
		return null
	}

	const setCurrentInput = (index: number | null) => {
		removeInputListener()
		let input = null
		if (index && index >= 0 && index < midiInputs.length) {
			input = midiInputs[index]
		}
		_setCurrentInput(input)

		addInputListener(input)
	}

	const removeInputListener = () => {
		if (currentInput) {
			WebMidi.getInputById(currentInput.id).removeListener(currentListener)
		}
	}

	const addInputListener = (input: Input | null) => {
		if (input) {
			const listener = WebMidi.getInputById(input.id).addListener("sysex", (e: any) => {
				// console.log(`sysex:`, e);

				// Validate and remove f0 / f7 head/tail?
				// Validate manufacturer and remove...?
				const { data: message } = e
				console.log(`rx sysex: ${bytesToHex(message)}`)
				const firstByte = message.shift()
				const lastByte = message.pop()
				if (firstByte != 0xf0 && lastByte != 0xf2) {
					console.log('is not a valid Sysex message ', firstByte, lastByte)
					return
				}
				setRxSysexMessage(message)
			});
			_setCurrentListener(listener)
		}
	}

	const getCurrentInput = (): Input | null => {
		if (currentInput) {
			return WebMidi.getInputById(currentInput.id)
		}
		return null
	}

	const sendSysexMessage = (data: Uint8Array) => {
		const output = getCurrentOutput()
		if (output) {
			console.log(`tx sysex: ${bytesToHex(data)}`)
			try {
				setTxSysexMessage({ manufacturer: currentManufacturer, data })
				output.sendSysex(currentManufacturer, data)
			} catch (RangeError) {
				console.log(`RangeError for: ${data}`)
			}
		}
	}

	const sendUniversalMessage = (manufacturer: number, data: Uint8Array) => {
		const output = getCurrentOutput()
		if (output) {
			console.log(`sending universal message: ${bytesToHex([manufacturer])} ${bytesToHex(data)}`)
			try {
				setTxSysexMessage({ manufacturer, data })
				output.sendSysex(manufacturer, data)
			} catch (RangeError) {
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
		sendUniversalMessage,
	}

	return (
		<WebMidiContext.Provider value={webMidiContextValue} >
			{children}
		</WebMidiContext.Provider>
	)
}

export default WebMidiContext
export { WebMidiContextProvider }
