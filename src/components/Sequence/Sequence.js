import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import Step from '../Step/Step'
import './Sequence.css';

const Sequence = () => {

  const {
		currentSequence,
    currentSequenceNumber,
    webMidiContext
	} = useContext(VolcaFMContext)
  
  const {
    midiInitialised,
	} = webMidiContext

  if(!midiInitialised) {
    return null
  }

  if(!currentSequence || !currentSequence?.steps?.length) {
    return (
      <p>Load a sequence</p>
    )
  }

  const steps = currentSequence.steps.map((step, index) =>
    <li className="sequence-step" key={index}><Step step={step}/></li>
  )

  return (
    <div className='sequence'>
      <h2>Current Sequence {currentSequenceNumber}</h2>
      <ul className="sequence-steps">
        {steps}
      </ul>
      <p>Motion data: {JSON.stringify(currentSequence.motionData)}</p>
      <p>Settings: {JSON.stringify(currentSequence.sequenceSettings)}</p>
    </div>
  )
}

export default Sequence