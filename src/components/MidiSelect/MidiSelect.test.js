// import { render } from "../../utils/test-utils"
import MidiSelect from './MidiSelect'

const input = {
  id: '1',
  manufacturer: 'Glen',
  name: 'Midi Input 1'
}

const output = {
  id: '1',
  manufacturer: 'Glen',
  name: 'Midi Output 1'
}

const inputs = [input]
const outputs = [output]

const mebWidi = {
  enable: jest.fn((options) => {
    console.log('mockEnable ', options)
    return Promise.resolve(options)
  }),
  inputs,
  outputs,
  getInputById: jest.fn((idToFind) => inputs.find(({ id }) => idToFind === id )),
  getOutputById: jest.fn((idToFind) => outputs.find(({ id }) => idToFind === id )),
}

test.only('Renders', async () => {
  console.log('mebWidi.enable ', mebWidi.enable)
  
  const value = await mebWidi.enable({ foo: 'bar' })
  console.log('value ', value)
  
  console.log('getInputById 1 ', mebWidi.getInputById('1'))

  // const { getByRole, container } = render(<MidiSelect/>, { WebMidi: mebWidi })
  // container.debug()
})