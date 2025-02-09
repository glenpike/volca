import React from 'react';
import { noteNumberToName, noteNumberToOctave, musicalNotes } from '../../utils/MidiNotes';
import './Note.css';

const Note = ({ on, number, velocity, gateTime, trigger, motionData }) => {
  const disabled = !(on && trigger);

  const noteOptions = ['-', ...musicalNotes]
  return (
    <div className="note">
      <input
        aria-label="Trigger Note"
        type="checkbox"
        checked={trigger}
        onChange={(e) => console.log("Trigger: ", e.target.checked)}
        disabled={!on}
      />
      <select aria-label="Note" defaultValue={noteNumberToName(number)} disabled={disabled}>
        {noteOptions.map((note, index) => (
          <option key={index} value={note}>
            {note}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="-1"
        max="8"
        defaultValue={noteNumberToOctave(number)}
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