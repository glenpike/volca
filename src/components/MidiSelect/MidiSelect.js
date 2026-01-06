import React, { useContext, useEffect } from 'react'
import './MidiSelect.css'
import VolcaFMContext from '../../contexts/VolcaFMContext'

const MidiSelect = () => {

  const {
    currentChannel,
    setCurrentChannel,
    webMidiContext,
  } = useContext(VolcaFMContext)

  const {
    currentOutput,
    currentInput,
    midiOutputs,
    midiInputs,
    setCurrentOutput,
    setCurrentInput,
    initialise,
    midiInitialised,
  } = webMidiContext

  const selectedOutput = midiOutputs && midiOutputs.indexOf(currentOutput)
  const selectedInput = midiInputs && midiInputs.indexOf(currentInput)

  useEffect(() => {
    if (!midiInitialised) {
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

  const channel = currentChannel !== null ? currentChannel + 1 : '';

  return (
    <div className='midi-selects'>
      <div className="midi-select">
        <label htmlFor="midi-input-select">Input Device</label>{' '}
        <select
          id="midi-input-select"
          name="midi-input-select"
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
          name="midi-output-select"
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
        <label htmlFor="midi-channel-select">Channel</label>{' '}
        <input type="number" id="midi-channel-select" name="midi-channel-select" min="1" max="16" value={channel} onChange={handleChannelChange} />
      </div>
    </div>
  )
}

export default MidiSelect
