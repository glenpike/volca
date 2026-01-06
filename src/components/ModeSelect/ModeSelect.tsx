import './ModeSelect.css'
import { useMidiMode } from "../../contexts/MidiModeContext";

const ModeSelect = () => {
  const { mode, setMode } = useMidiMode();

  const handleModeChange = () => {
    setMode(mode === 'real' ? 'test' : 'real');
  }
  return (
    <>
      <span className="mode-select-label" id="mode-select">"Test Midi" Mode</span>
      <button className="mode-select-button" role="switch" aria-checked={mode === 'test'} aria-labelledby="mode-select" onClick={handleModeChange}>
        <span>on</span>
        <span>off</span>
      </button>
    </>
  )
}

export default ModeSelect