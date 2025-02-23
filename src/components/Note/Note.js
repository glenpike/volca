import React from 'react';
import { noteNumberToName, noteNumberToOctave, musicalNotes } from '../../utils/MidiNotes';
import './Note.css';

const Note = ({ note, motionData }) => {
  const disabled = !(note.on && note.trigger);

  const noteOptions = ['-', ...musicalNotes]
  return (
    <div className="note">
      <input
        aria-label="Trigger Note"
        type="checkbox"
        checked={note.trigger}
        onChange={(e) => console.log("Trigger: ", e.target.checked)}
        disabled={!note.on}
      />
      <select aria-label="Note" defaultValue={noteNumberToName(note.number)} disabled={disabled}>
        {noteOptions.map((noteString, index) => (
          <option key={index} value={noteString}>
            {noteString}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="-1"
        max="8"
        defaultValue={noteNumberToOctave(note.number)}
        aria-label="Octave"
        disabled={disabled}
      />
      <input type="number" min="0" max="127" defaultValue={note.velocity} aria-label="Velocity" disabled={disabled}/>
      <input type="number" min="0" max="100" defaultValue={note.gateTime} aria-label="Gate Time" disabled={disabled}/>
      <p className="noteMotionData">Motion Data: {JSON.stringify(motionData)}</p>
    </div>
  );
};

export default Note;