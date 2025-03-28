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
  const noteOptions = ['-', ...musicalNotes]

  const handleNoteChange = (event) => {
    // Or what??
    if(event.target.value !== '-') {
      const newNoteNumber = noteToMidi(`${event.target.value}${noteNumberToOctave(noteNumber)}`)
      updateNote(sequenceId, stepId, noteId, { note: [newNoteNumber, otherNoteValue] })
    }
  }

  const handleOctaveChange = (event) => {
    const newNoteNumber = noteToMidi(`${noteNumberToName(noteNumber)}${event.target.value}`)
    updateNote(sequenceId, stepId, noteId, { note: [newNoteNumber, otherNoteValue] })
  }

  const handleVelocityChange = (event) => {
    updateNote(sequenceId, stepId, noteId, { velocity: parseInt(event.target.value, 10) })
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
        onChange={(e) => console.log("Trigger: ", e.target.checked)}
        disabled={!note.on}
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
      {/* Make this 0-100 and a checkbox to 'tie' the note */}
      <input
        aria-label="Gate Time"
        type="number"
        min="0"
        max="127"
        defaultValue={gateTime}
        onChange={handleGateTimeChange}
        disabled={disabled}
      />
      <p className="noteData">Note Data: {gateTime}</p>
      <p className="noteMotionData">Motion Data: {JSON.stringify(note.motionData)}</p>
    </div>
  )
}

export default Note