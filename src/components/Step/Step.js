import React from 'react'
import Note from '../Note/Note'
import './Step.css';


const Step = ({ stepNumber, stepData }) => {
  const { on, active, stepData: { _data: noteData } } = stepData

  const notes = noteData.voiceNoteNumbers.map((note, index) => {
    const { gateTime, trigger } = noteData.voiceGateTimes[index]
    return (
      <li className="step-note" key={index}>
        <Note
          on={on}
          number={note[0]}
          velocity={noteData.voiceVelocities[index]}
          gateTime={gateTime}
          trigger={trigger}
          motionData={noteData.motionData} />
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
        {notes}
      </ul>
      {/* <p>noteData {JSON.stringify(noteData)}</p> */}
    </span>
  )
}

export default Step