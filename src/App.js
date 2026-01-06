import Wrapper from './Wrapper';
import MidiProvider from './components/MidiProvider/MidiProvider';

import './App.css';

function App() {
  return (
    <MidiProvider>
      <div className="App">
        <Wrapper />
      </div>
    </MidiProvider>
  )
}

export default App;
