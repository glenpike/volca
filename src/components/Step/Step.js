import React from 'react'
import Note from '../Note/Note'
import './Step.css';


const Step = ({ step }) => {
  const { id, on, notes = [], motionData = []} = step
  
  const noteComponents = notes.map((note) => {
    return (
      <li className="step-note" key={`${id}_${note.id}`}>
        <Note
          on={on}
          note={note}
          motionData={motionData} />
      </li>
    )
  })

  return (
    <span key={id} className="step">
      <p><strong>{id + 1}</strong></p>
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
      {/* <p>step {stepData.toJSON()}</p> */}
    </span>
  )
}

export default Step