import React from 'react'
import MidiSelect from './components/MidiSelect/MidiSelect'
import GetSequence from './components/GetSequence/GetSequence'
import Sequence from './components/Sequence/Sequence'
import SequenceDebug from './components/SequenceDebug/SequenceDebug'
import MidiProvider from './components/MidiProvider/MidiProvider';

import './App.css';

function App() {
  return (
    <MidiProvider>
      <div className="App">
        <header className="App-header">
          <div className="control__bar">
            <h1 className="control__heading">KORG volca fm Sequences</h1>
            <MidiSelect />
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
      </div>
    </MidiProvider>
  )
}

export default App;
