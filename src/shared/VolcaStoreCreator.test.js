
import { create } from 'zustand'
import { act, renderHook } from '@testing-library/react';
import { VolcaStoreCreator } from './VolcaStoreCreator'
import { unpackedData } from '../../test/sequenceBytes'
import { parseSequenceBytes } from '../utils/Volca/parseSequence'

const addSequence = async (store, number) => {
  const sequence = parseSequenceBytes([...unpackedData])

  return new Promise((resolve) => {
    act(() => {
      store.addOrUpdateSequence(sequence, number)
    })
    resolve(sequence)
  })
}
describe('VolcaStore', () => {
  test('currentSequenceNumber default', () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())
    expect(result.current.currentSequenceNumber).toBe(-1)
  })

  test('sequences default', () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())
    expect(result.current.sequences).toEqual([])
  })

  test('can add a sequence', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    const sequence = await addSequence(result.current, 0)
    expect(result.current.sequences).toEqual([sequence])
    expect(result.current.currentSequenceNumber).toBe(0)
  })

  test('missing sequence number defaults to 16', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    const sequence = await addSequence(result.current)

    expect(result.current.currentSequenceNumber).toBe(16)
  })

  test('can clear sequences', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    await addSequence(result.current)

    act(() => {
      result.current.clearSequences()
    })
    expect(result.current.sequences).toEqual([])
    expect(result.current.currentSequenceNumber).toBe(-1)
  })

  test('can retrieve a sequence', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    const sequence = await addSequence(result.current, 0)
    let currentSequence
    act(() => {
      currentSequence = result.current.getSequence(0)
    })
    expect(currentSequence).toEqual(sequence)
  })

  test('updateStep', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    const sequence = await addSequence(result.current, 0)

    const step = result.current.sequences[0].steps[0]

    expect(step.on).toBe(true)
    expect(step.active).toBe(true)
    expect(step.notes.length).toBe(6)
    expect(step.motionFuncTranspose).toEqual(false)
    act(() => {
      result.current.updateStep(0, 0, { on: false, active: false, motionFuncTranspose: true })
    })
    const updatedStep = result.current.sequences[0].steps[0]
    expect(updatedStep.on).toBe(false)
    expect(updatedStep.active).toBe(false)
    expect(updatedStep.motionFuncTranspose).toEqual(true)
  })

  test('updateNote', async () => {
    const useStore = create(VolcaStoreCreator)
    const { result } = renderHook(() => useStore())

    const sequence = await addSequence(result.current, 0)
    const note = result.current.sequences[0].steps[0].notes[0]
    expect(note.note).toEqual([54, 0])
    expect(note.velocity).toBe(64)
    expect(note.gateTimeInt).toBe(33)
    expect(note.trigger).toBe(true)
    act(() => {
      result.current.updateNote(0, 0, 0, { note: [72, 0], velocity: 64 })
    })
    const updatedNote = result.current.sequences[0].steps[0].notes[0]
    expect(updatedNote.note).toEqual([72, 0])
    expect(updatedNote.velocity).toBe(64)
    expect(updatedNote.gateTimeInt).toBe(33)
    expect(updatedNote.trigger).toBe(true)
  })
})