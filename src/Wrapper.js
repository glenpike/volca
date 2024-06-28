import React, { useContext } from 'react'
import MidiSelect from './components/MidiSelect/MidiSelect'
import { VolcaFMContextProvider } from './contexts/VolcaFMContext'
import WebMidiContext from './contexts/WebMidiContext'
import GetSequence from './components/GetSequence/GetSequence'
import Sequence from './components/Sequence/Sequence'
import TestWebMidiContext from './contexts/TestWebMidiContext'
import SequenceDebug from './components/SequenceDebug/SequenceDebug'

const Wrapper = () => {
  // const webMidi = useContext(WebMidiContext)
  const webMidi = useContext(TestWebMidiContext)
	return(
		<React.Fragment>
      <VolcaFMContextProvider channel={2} injectedWebMidiContext={webMidi}>
      <header className="App-header">
      <div className="control__bar">
        <h1 className="control__heading">Korg Volca FM2 Sequences</h1>
        <MidiSelect />
      </div>
      </header>
      <main>
      <div className="control__layout">
        <>
          <GetSequence/>
          <Sequence/>
          <SequenceDebug/>
        </>
      </div>
      </main>
      </VolcaFMContextProvider>
		</React.Fragment>
	)
}

export default Wrapper
