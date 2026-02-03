import React, { useContext, useState, ChangeEvent } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { useVolcaStore } from '../../stores/useVolcaStore'
import { MidiContextType } from '../../types'

const GetSequence = () => {
  const {
    deviceInquiry,
    saveToSequenceNumber,
    loadCurrentSequence,
    loadSequenceNumber,
    webMidiContext,
  } = useContext(VolcaFMContext)

  const currentSequenceNumber = useVolcaStore((state) => state.currentSequenceNumber);


  const {
    midiInitialised,
  } = webMidiContext as MidiContextType

  const [sequenceInput, setSequenceInput] = useState(
    String(Math.min(16, Math.max(1, currentSequenceNumber)))
  )

  const handleSequenceNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSequenceInput(event.target.value)
  }

  const getClampedSequenceNumber = () => {
    const raw = Number(sequenceInput)
    return Math.min(16, Math.max(1, raw || 1))
  }

  const handleGetSequenceNumber = () => {
    loadSequenceNumber(getClampedSequenceNumber())
  }

  const handleSaveSequenceNumber = () => {
    saveToSequenceNumber(getClampedSequenceNumber())
  }

  if (!midiInitialised) {
    return null
  }

  return (
    <fieldset className="group-control">
      <legend>Get Sequence</legend>
      <div className="flex-column">
        <div className="flex-row">
          <label htmlFor="sequence-select">Sequence Number</label>{' '}
          <input type="number" id="sequence-select" min="1" max="16" value={sequenceInput} onChange={handleSequenceNumberChange} />
          <button className="button button--primary" onClick={handleGetSequenceNumber}>Load</button>
          <button className="button button--primary" onClick={handleSaveSequenceNumber}>Save current to...</button>
        </div>
        <div className="flex-row">
          <button className="button button--primary" onClick={loadCurrentSequence}>Load Current</button>
          <button className="button button--secondary" onClick={deviceInquiry}>Check Device</button>
        </div>
      </div>
    </fieldset>
  )
}

export default GetSequence