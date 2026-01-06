import { useMidiMode } from "../../contexts/MidiModeContext";

const ModeSelect = () => {
  const { mode, setMode } = useMidiMode();

  const handleModeChange = () => {
    setMode(mode === 'real' ? 'test' : 'real');
  }
  return (
    <label>
      Test Mode? <input type="checkbox" name="testMode" checked={mode === 'test'} onChange={handleModeChange} />
    </label>
  )
}

export default ModeSelect