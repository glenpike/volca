import { WebMidiContextProvider } from './contexts/WebMidiContext'
import { TestWebMidiContextProvider } from './contexts/TestWebMidiContext';
import Wrapper from './Wrapper';

import './App.css';

const KORG_MANUFACTURER_ID = 0x42

function App() {
  return (
    <TestWebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}>
    {/* <WebMidiContextProvider manufacturer={KORG_MANUFACTURER_ID}> */}
      <div className="App">
        <Wrapper/>
      </div>
    {/* </WebMidiContextProvider> */}
    </TestWebMidiContextProvider>
  );
}

export default App;
