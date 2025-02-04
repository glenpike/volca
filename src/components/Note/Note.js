import React from 'react';
import { musicalNoteName, musicalOctave } from '../../utils/MidiNotes';

const Note = ({ number, velocity, gateTime, trigger, motionData }) => {
  return (
    <div>
      <label>
        Trigger:
        <input
          type="checkbox"
          checked={trigger}
          onChange={(e) => console.log("Trigger: ", e.target.checked)}
        />
      </label>
      <select aria-label="Note" defaultValue={musicalNoteName(number)} disabled={!trigger}>
        {['-', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note, index) => (
          <option key={index} value={note}>
            {note}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="-1"
        max="8"
        defaultValue={musicalOctave(number)}
        aria-label="Octave"
        disabled={!trigger}
      />
      <input type="number" min="0" max="127" defaultValue={velocity} aria-label="Velocity" disabled={!trigger}/>
      <input type="number" min="0" max="100" defaultValue={gateTime} aria-label="Gate Time" disabled={!trigger}/>
      {/* <p>Motion Data: {JSON.stringify(motionData)}</p> */}
    </div>
  );
};

export default Note;