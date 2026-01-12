import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { useVolcaStore } from '../../stores/useVolcaStore'
import Step from '../Step/Step'
import './Sequence.css';
import { SequenceInfo, StepInfo } from '../../types'

const Sequence = () => {
  const {
    webMidiContext
  } = useContext(VolcaFMContext)

  const currentSequenceNumber = useVolcaStore((state) => state.currentSequenceNumber);
  const currentSequence = useVolcaStore(state => state.sequences.find((seq: SequenceInfo) => seq.programNumber === currentSequenceNumber))

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

  const steps = currentSequence.steps.map((step: StepInfo, index: number) =>
    <li className="sequence-step" key={index}><Step step={step} sequenceId={currentSequence.programNumber} /></li>
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