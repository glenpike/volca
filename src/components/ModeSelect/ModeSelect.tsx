import './ModeSelect.css'
import { useMidiMode } from "../../contexts/MidiModeContext";
import ToggleButton from "../common/ToggleButton/ToggleButton";

const ModeSelect = () => {
  const { mode, setMode } = useMidiMode();

  const handleModeChange = () => {
    setMode(mode === 'real' ? 'test' : 'real');
  }
  return (
    <ToggleButton
      label="Midi Mode"
      onLabel="Test"
      offLabel="Live"
      checked={mode === 'test'}
      onClick={handleModeChange}
      primary={true}
    />
  )
}

export default ModeSelect