import React from 'react'
import Note from '../Note/Note'
import './Step.css';


const Step = ({ stepNumber, stepData }) => {
  const { on, active, stepData: { _data: noteData } } = stepData

  const notes = noteData.voiceNoteNumbers.map((note, index) => {
    const { gateTime, trigger } = noteData.voiceGateTimes[index]
    return (
      <li className="step-note">
        <Note key={index}
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
      <p>On: {on ? 'Yes' : 'No'}</p>
      <p>Active: {active ? 'Yes' : 'No'}</p>
      <ul className="step-notes">
        {notes}
      </ul>
      {/* <p>noteData {JSON.stringify(noteData)}</p> */}
    </span>
  )
}

export default Step