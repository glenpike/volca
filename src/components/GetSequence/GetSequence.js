import React, { useContext, useState } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext.js'

const GetSequence = () => {
	const {
    currentSequenceNumber,
		setCurrentSequenceNumber,
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

  const handleGetSequence = () => {
    setCurrentSequenceNumber(_sequenceNumber)
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
				</div>
				<button onClick={handleGetSequence}>Load</button>
			</div>
    </fieldset>
  )
}

export default GetSequence