import { screen, act } from '@testing-library/react'
import { webmidiRender } from '../../../test/TestWrappers'
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
  enable: (options) => Promise.resolve(options),
  inputs,
  outputs,
  getInputById: (idToFind) => inputs.find(({ id }) => idToFind === id),
  getOutputById: (idToFind) => outputs.find(({ id }) => idToFind === id),
}

describe('MidiSelect ', () => {
  // test  ('WebMidiMocking', async () => {
  //   console.log('mebWidi.enable ', mebWidi.enable)
  //   const value = await mebWidi.enable({ foo: 'bar' })
  //   console.log('value ', value)
  //   console.log('getInputById 1 ', mebWidi.getInputById('1'))
  // })

  test('Renders the Midi Input Selector', async () => {
    await act(async () => {
      webmidiRender(<MidiSelect />, { WebMidi: mebWidi })
    })

    const input = screen.getByRole("combobox", { name: "Input Device" })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('-1')
  })

  test('Renders the Midi Output Selector', async () => {
    await act(async () => {
      webmidiRender(<MidiSelect />, { WebMidi: mebWidi })
    })
    const output = screen.getByRole("combobox", { name: "Output Device" })
    expect(output).toBeInTheDocument()
    expect(output).toHaveValue('-1')
  })

  test('Renders the Midi Channel Selector', async () => {
    const channel = 4
    await act(async () => {
      webmidiRender(<MidiSelect />, { WebMidi: mebWidi, channel })
    })

    const output = screen.getByRole("spinbutton", { name: "Channel" })
    expect(output).toBeInTheDocument()
    expect(output).toHaveValue(channel)
  })
})