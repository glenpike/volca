import React, { useContext, useEffect } from 'react'
import WebMidiContext from '../../contexts/WebMidiContext.js'

import './MidiSelect.css'

const MidiSelect = () => {
	const {
		currentOutput,
    currentInput,
    currentChannel,
		midiOutputs,
    midiInputs,
		setCurrentOutput,
    setCurrentInput,
    setCurrentChannel,
		initialise,
    midiInitialised,
	} = useContext(WebMidiContext)

	const selectedOutput = midiOutputs && midiOutputs.indexOf(currentOutput)
  const selectedInput = midiInputs && midiInputs.indexOf(currentInput)

	useEffect(() => {
    if(!midiInitialised) {
		  initialise()
    }
	}, [midiInitialised])

	const handleOutputChange = (event) => {
		const index = +event.target.value
		setCurrentOutput(index)
	}

  const handleInputChange = (event) => {
		const index = +event.target.value
		setCurrentInput(index)
	}

  const handleChannelChange = (event) => {
    setCurrentChannel(event.target.value - 1)
  }

	return (
    <div className='midi-selects'>
      <div className="midi-select">
        <label htmlFor="midi-input-select">Input Device</label>{' '}
        <select
          id="midi-input-select"
          value={selectedInput}
          onChange={handleInputChange}
        >
          <option value="-1"> Please select </option>{' '}
          {midiInputs.map((midiInput, index) => {
            return (
              <option key={index} value={index}>
                {midiInput.name}
              </option>
            )
          })}{' '}
        </select>
      </div>
      <div className="midi-select">
        <label htmlFor="midi-output-select">Output Device</label>{' '}
        <select
          id="midi-output-select"
          value={selectedOutput}
          onChange={handleOutputChange}
        >
          <option value="-1"> Please select </option>{' '}
          {midiOutputs.map((midiOutput, index) => {
            return (
              <option key={index} value={index}>
                {midiOutput.name}
              </option>
            )
          })}{' '}
        </select>
      </div>
      <div className="midi-select">
        <label htmlFor="midi-output-select">Channel</label>{' '}
        <input type="number" id="midi-channel-select" min="1" max="16" value={currentChannel+1} onChange={handleChannelChange}/>
      </div>
    </div>
	)
}

export default MidiSelect