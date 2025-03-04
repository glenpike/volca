import React, { useContext, useState } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext.js'

const GetSequence = () => {
	const {
    deviceInquiry,
    currentSequenceNumber,
    saveCurrentSequence,
    saveSequenceNumber,
    loadCurrentSequence,
		loadSequenceNumber,
    webMidiContext,
	} = useContext(VolcaFMContext)

  const {
    midiInitialised,
	} = webMidiContext
  
  //Seems yucky - can we do 'uncontrolled'? 
  const [_sequenceNumber, setSequenceNumber] = useState(currentSequenceNumber)

  const handleSequenceNumberChange = (event) => {
    setSequenceNumber(event.target.value)
  }

  const handleGetSequenceNumber = () => {
    loadSequenceNumber(_sequenceNumber)
  }

  const handleSaveSequenceNumber = () => {
    saveSequenceNumber(_sequenceNumber)
  }

  if(!midiInitialised) {
    return null
  }

  return (
		<fieldset className="group-control">
			<legend>Get Sequence</legend>
			<div className="get-sequence">
				<div className="sequence-select">
					<label htmlFor="sequence-select">Sequence Number</label>{' '}
					<input type="number" id="sequence-select" min="1" max="16" value={_sequenceNumber} onChange={handleSequenceNumberChange}/>
          <button onClick={handleGetSequenceNumber}>Load</button>
          <button onClick={handleSaveSequenceNumber}>Save</button>
        </div>
        <button onClick={loadCurrentSequence}>Load Current</button>
        <button onClick={saveCurrentSequence}>Save Current</button>
				<button onClick={deviceInquiry}>Check Device</button>
			</div>
    </fieldset>
  )
}

export default GetSequence