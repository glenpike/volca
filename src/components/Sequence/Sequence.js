import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import useVolcaStore from '../../stores/useVolcaStore'
import Step from '../Step/Step'
import './Sequence.css';

const Sequence = () => {
  const {
    webMidiContext
	} = useContext(VolcaFMContext)
  
  const currentSequenceNumber = useVolcaStore((state) => state.currentSequenceNumber);
  console.log('Sequence currentSequenceNumber', currentSequenceNumber)
  const currentSequence = useVolcaStore(state => state.sequences.find((seq) => seq.programNumber === currentSequenceNumber))
  
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
      <p>Programme Number: {currentSequence.programNumber}</p>
      <ul className="sequence-steps">
        {steps}
      </ul>
      <p>Motion data: {JSON.stringify(currentSequence.motionData)}</p>
      <p>Settings: {JSON.stringify(currentSequence.sequenceSettings)}</p>
    </div>
  )
}

export default Sequence