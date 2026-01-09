import React, { ChangeEvent, useContext, useEffect } from 'react'
import './MidiSelect.css'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import ModeSelect from '../ModeSelect/ModeSelect'
import { useMidiMode } from '../../contexts/MidiModeContext'
import { MidiContextType, VolcaFMContextType } from '../../types'

const MidiSelect = () => {

  const {
    currentChannel,
    setCurrentChannel,
    webMidiContext,
  } = useContext(VolcaFMContext) as VolcaFMContextType

  const {
    currentOutput,
    currentInput,
    midiOutputs,
    midiInputs,
    setCurrentOutput,
    setCurrentInput,
    initialise,
    midiInitialised,
  } = webMidiContext as MidiContextType

  const selectedOutput = currentOutput ? midiOutputs.indexOf(currentOutput) : -1
  const selectedInput = currentInput ? midiInputs.indexOf(currentInput) : -1
  const { mode } = useMidiMode();

  useEffect(() => {
    if (!midiInitialised) {
      initialise()
    }
  }, [midiInitialised])

  const handleOutputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = Number(event.target.value)
    setCurrentOutput(index)
  }

  const handleInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = Number(event.target.value)
    setCurrentInput(index)
  }

  const handleChannelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentChannel(Number(event.target.value) - 1)
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
          disabled={mode === 'test'}
        >
          <option value="-1"> Please select </option>{' '}
          {midiInputs?.map((midiInput, index) => {
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
          disabled={mode === 'test'}
        >
          <option value="-1"> Please select </option>{' '}
          {midiOutputs?.map((midiOutput, index) => {
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
        <input type="number" id="midi-channel-select" name="midi-channel-select" min="1" max="16" value={channel} onChange={handleChannelChange} disabled={mode === 'test'} />
      </div>
      <ModeSelect />
    </div>
  )
}

export default MidiSelect
