import React from 'react'
import MidiSelect from './components/MidiSelect/MidiSelect'
import GetSequence from './components/GetSequence/GetSequence'
import Sequence from './components/Sequence/Sequence'
import SequenceDebug from './components/SequenceDebug/SequenceDebug'
import ModeSelect from './components/ModeSelect/ModeSelect'
import { useMidiMode } from './contexts/MidiModeContext'

const Wrapper = () => {

  const { mode } = useMidiMode();

  return (
    <>
      <header className="App-header">
        <div className="control__bar">
          <h1 className="control__heading">Korg Volca FM2 Sequences</h1>
          <ModeSelect />
          {mode === 'real' && <MidiSelect />}
        </div>
      </header>
      <main>
        <div className="control__layout">
          <>
            <GetSequence />
            <Sequence />
            <SequenceDebug />
          </>
        </div>
      </main>
    </>
  )
}

export default Wrapper
