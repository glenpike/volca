import React from 'react'
import Note from '../Note/Note'
import './Step.css';
import { StepInfo } from '../../types'
import { useVolcaStore } from '../../stores/useVolcaStore'

interface StepProps {
  sequenceId: number;
  stepId: number;
}

const Step = ({ sequenceId, stepId }: StepProps) => {
  const step: StepInfo | undefined = useVolcaStore((state) =>
    state.sequences[sequenceId]
      ?.steps.find((step: StepInfo) => step.id === stepId)
  )
  const updateStep = useVolcaStore((state) => state.updateStep)

  if (!step) {
    return null
  }

  const { id, on, active, notes = [], motionData = [] } = step

  const handleOnOffChange = (event: any) => {
    const on = !!event.target.checked
    updateStep(sequenceId, id, { on })
  }

  const idString = `${sequenceId}-${id}`

  const noteComponents = notes.map((note) => {
    return (
      <li className="step-note" key={`note-${idString}-${note.id}`}>
        <Note
          sequenceId={sequenceId}
          stepId={id}
          noteId={note.id}
          on={on}
          motionData={motionData} />
      </li>
    )
  })

  return (
    <span key={`step-${idString}`} className="step">
      <p><strong>{id + 1}</strong></p>
      <label>
        Step On:
        <input type="checkbox" checked={on} onChange={handleOnOffChange} />
      </label>
      <p>Step Active: {active ? 'Yes' : 'No'}</p>
      <ul className="step-notes">
        {noteComponents}
      </ul>
      {/* <p>step {JSON.stringify(motionData)}</p> */}
    </span>
  )
}

export default Step