import KORG_MIDI_NOTES, {
  musicalNotes,
  noteNumberToOctave,
  noteNumberToName,
  midiToNote,
  noteToMidi
} from './MidiNotes';

describe('MidiNotes Utilities', () => {
  test('KORG_MIDI_NOTES array should have 128 elements', () => {
    expect(KORG_MIDI_NOTES.length).toBe(128);
  });

  test('First KORG MIDI NOTE should be C-1', () => {
    expect(KORG_MIDI_NOTES[0]).toBe('C-1');
  });

  test('musicalNotes array should have 12 elements', () => {
    expect(musicalNotes.length).toBe(12);
  });

  test('noteNumberToOctave should return correct octave', () => {
    expect(noteNumberToOctave(0)).toBe(-1);
    expect(noteNumberToOctave(12)).toBe(0);
    expect(noteNumberToOctave(24)).toBe(1);
    expect(noteNumberToOctave(60)).toBe(4);
  });

  test('noteNumberToName should return correct note name', () => {
    expect(noteNumberToName(0)).toBe('C');
    expect(noteNumberToName(1)).toBe('C#');
    expect(noteNumberToName(2)).toBe('D');
    expect(noteNumberToName(11)).toBe('B');
  });

  test('midiToNote should return correct note', () => {
    expect(midiToNote(0)).toBe('C-1');
    expect(midiToNote(24)).toBe('C1');
    expect(midiToNote(60)).toBe('C4');
    expect(midiToNote(127)).toBe('G9');
  });

  test('noteToMidi should return correct MIDI number', () => {
    expect(noteToMidi('C-1')).toBe(0);
    expect(noteToMidi('C1')).toBe(24);
    expect(noteToMidi('C4')).toBe(60);
    expect(noteToMidi('G9')).toBe(127);
  });

  test('noteToMidi should return -1 for invalid note', () => {
    expect(noteToMidi('H2')).toBe(-1);
    expect(noteToMidi('C#10')).toBe(-1);
  });
});