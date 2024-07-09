import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'

import Step from '../Step/Step'

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
    <Step key={index} stepNumber={index} stepData={step}/>
  )

  return (
    <div className='sequence'>
      <h2>Current Sequence {currentSequenceNumber}</h2>
      <p>Motion data: {JSON.stringify(currentSequence.motionData)}</p>
      <ul className="sequence-steps">
        {steps}
      </ul>
    </div>
  )
}

export default Sequence