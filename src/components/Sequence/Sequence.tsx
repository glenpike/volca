import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { useVolcaStore, CURRENT_VOLCA_SEQUENCE_INDEX } from '../../stores/useVolcaStore'
import Step from '../Step/Step'
import './Sequence.css';
import { StepInfo } from '../../types'

const Sequence = () => {
  const {
    webMidiContext
  } = useContext(VolcaFMContext)

  console.log('sequence...')
  const currentSequenceNumber = useVolcaStore((state) => state.currentSequenceNumber);
  const currentSequence = useVolcaStore(state => state.sequences[currentSequenceNumber])

  const {
    midiInitialised,
  } = webMidiContext!

  if (!midiInitialised) {
    return null
  }

  if (!currentSequence || !currentSequence?.steps?.length) {
    return (
      <p>Load a sequence</p>
    )
  }

  const steps = currentSequence.steps.map((_step: StepInfo, index: number) =>
    <li className="sequence-step" key={index}><Step stepId={index} sequenceId={currentSequenceNumber} /></li>
  )

  const heading = () => {

  }

  return (
    <div className='sequence'>
      {currentSequenceNumber === CURRENT_VOLCA_SEQUENCE_INDEX ?
        <h2>Current Sequence</h2> :
        <h2>Sequence {currentSequenceNumber + 1}</h2>
      }
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