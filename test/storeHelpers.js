import { act } from '@testing-library/react'
import { unpackedData } from './sequenceBytes'
import { parseSequenceBytes } from '../src/utils/Volca/parseSequence'

export const addSequenceToStore = async (store, number) => {
  const sequence = parseSequenceBytes([...unpackedData])

  return new Promise((resolve) => {
    act(() => {
      store.addOrUpdateSequence(sequence, number)
    })
    resolve(sequence)
  })
}