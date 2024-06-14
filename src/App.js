import { WebMidiContextProvider } from './contexts/WebMidiContext.js'
import Wrapper from './Wrapper.js';

import './App.css';
import { VolcaFMContextProvider } from './contexts/VolcaFMContext.js';

const KORG_MANUFACTURER_ID = 0x42

function App() {
  return (
    <WebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}>
      <div className="App">
        <Wrapper/>
      </div>
    </WebMidiContextProvider>
  );
}

export default App;
