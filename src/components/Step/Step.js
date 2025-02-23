import React from 'react'
import Note from '../Note/Note'
import './Step.css';


const Step = ({ stepNumber, stepData }) => {
  const on = stepData.on
  const { notes = [], motionData = {} } = stepData.data

  const noteComponents = notes.map((note) => {
    return (
      <li className="step-note" key={note.stepNoteId}>
        <Note
          note={note}
          motionData={motionData} />
      </li>
    )
  })

  return (
    <span key={stepNumber} className="step">
      <p><strong>{stepNumber + 1}</strong></p>
      <label>
        Step On:
        <input type="checkbox" checked={on} readOnly />
      </label>
      {/* <label>
        Active:
        <input type="checkbox" checked={active} readOnly />
      </label> */}
      <ul className="step-notes">
        {noteComponents}
      </ul>
      <p>step {stepData.toJSON()}</p>
    </span>
  )
}

export default Step