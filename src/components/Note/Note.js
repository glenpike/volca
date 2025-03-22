import React from 'react';
import { noteNumberToName, noteNumberToOctave, musicalNotes } from '../../utils/MidiNotes';
import './Note.css';

const Note = ({ on, note, motionData }) => {
  const { trigger, note: [noteNumber], velocity, gateTime } = note
  const disabled = !(on && trigger);
  const noteOptions = ['-', ...musicalNotes]

  return (
    <div className="note">
      <input
        aria-label="Trigger Note"
        type="checkbox"
        checked={note.trigger}
        onChange={(e) => console.log("Trigger: ", e.target.checked)}
        disabled={!on}
      />
      <select aria-label="Note" defaultValue={noteNumberToName(noteNumber)} disabled={disabled}>
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
        defaultValue={noteNumberToOctave(noteNumber)}
        aria-label="Octave"
        disabled={disabled}
      />
      <input type="number" min="0" max="127" defaultValue={velocity} aria-label="Velocity" disabled={disabled}/>
      <input type="number" min="0" max="100" defaultValue={gateTime} aria-label="Gate Time" disabled={disabled}/>
      <p className="noteMotionData">Motion Data: {JSON.stringify(motionData)}</p>
    </div>
  );
};

export default Note;