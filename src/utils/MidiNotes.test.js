import midiNotes, { musicalNotes, noteNumberToOctave, noteNumberToName, midiToNote, noteToMidi } from './MidiNotes';

describe('MidiNotes Utilities', () => {
  test('midiNotes array should have 128 elements', () => {
    expect(midiNotes.length).toBe(128);
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
    expect(midiToNote(0)).toBe('C-2');
    expect(midiToNote(24)).toBe('C0');
    expect(midiToNote(60)).toBe('C3');
    expect(midiToNote(127)).toBe('G8');
  });

  test('noteToMidi should return correct MIDI number', () => {
    expect(noteToMidi('C-2')).toBe(0);
    expect(noteToMidi('C0')).toBe(24);
    expect(noteToMidi('C3')).toBe(60);
    expect(noteToMidi('G8')).toBe(127);
  });

  test('noteToMidi should return -1 for invalid note', () => {
    expect(noteToMidi('H2')).toBe(-1);
    expect(noteToMidi('C#9')).toBe(-1);
  });
});