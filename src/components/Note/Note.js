import React from 'react'
import { useVolcaStore } from '../../stores/useVolcaStore'
import { noteNumberToName, noteNumberToOctave, musicalNotes, noteToMidi } from '../../utils/MidiNotes'
import './Note.css'

const Note = ({ noteId, sequenceId, stepId, on, motionData }) => {
  const note = useVolcaStore((state) =>
    state.sequences
      .find((seq) => seq.programNumber === sequenceId)
      ?.steps.find((step) => step.id === stepId)
      ?.notes.find((note) => note.id === noteId)
  )

  const updateNote = useVolcaStore((state) => state.updateNote)

  if (!note) {
    return null
  }
  
  const { trigger, note: [noteNumber, otherNoteValue], velocity, gateTime } = note
  const disabled = !(on && trigger)
  const noteOptions = [...musicalNotes]
  const tiedNote = gateTime == 127

  const handleTriggerChange = (event) => {
    const trigger = !!event.target.checked
    updateNote(sequenceId, stepId, noteId, { trigger })
  }

  const handleNoteChange = (event) => {
    const newNoteNumber = noteToMidi(`${event.target.value}${noteNumberToOctave(noteNumber)}`)
    updateNote(sequenceId, stepId, noteId, { note: [newNoteNumber, otherNoteValue] })
  }

  const handleOctaveChange = (event) => {
    const newNoteNumber = noteToMidi(`${noteNumberToName(noteNumber)}${event.target.value}`)
    updateNote(sequenceId, stepId, noteId, { note: [newNoteNumber, otherNoteValue] })
  }

  const handleVelocityChange = (event) => {
    updateNote(sequenceId, stepId, noteId, { velocity: parseInt(event.target.value, 10) })
  }

  const handleTiedNoteChange = (event) => {
    const tiedNote = !!event.target.checked
    const newGateTime = tiedNote ? 127 : 100
    updateNote(sequenceId, stepId, noteId, { gateTime: newGateTime })
  }

  const handleGateTimeChange = (event) => {
    let newGateTime = parseInt(event.target.value, 10)
    updateNote(sequenceId, stepId, noteId, { gateTime: newGateTime })
  }

  return (
    <div className="note">
      <input
        aria-label="Trigger Note"
        type="checkbox"
        checked={note.trigger}
        onChange={handleTriggerChange}
      />
      <select
        aria-label="Note"
        defaultValue={noteNumberToName(noteNumber)}
        onChange={handleNoteChange}
        disabled={disabled}
      >
        {noteOptions.map((noteString, index) => (
          <option key={index} value={noteString}>
            {noteString}
          </option>
        ))}
      </select>
      <input
        aria-label="Octave"
        type="number"
        min="-1"
        max="8"
        defaultValue={noteNumberToOctave(noteNumber)}
        onChange={handleOctaveChange}
        disabled={disabled}
      />
      <input
        aria-label="Velocity"
        type="number"
        min="0"
        max="127"
        defaultValue={velocity}
        onChange={handleVelocityChange}
        disabled={disabled}
      />
      <input
        aria-label="Gate Time"
        type="number"
        min="0"
        max="127"
        value={gateTime}
        onChange={handleGateTimeChange}
        disabled={disabled || tiedNote}
      />
      <input
        aria-label="Tie Note"
        type="checkbox"
        checked={tiedNote}
        onChange={handleTiedNoteChange}
      />
      <p className="noteMotionData">Motion Data: {JSON.stringify(motionData)}</p>
    </div>
  )
}

export default Note