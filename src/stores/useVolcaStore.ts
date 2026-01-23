import { create } from 'zustand'
import { VolcaState } from '../types'
import { VolcaStoreCreator } from '../shared/VolcaStoreCreator'

export const useVolcaStore = create<VolcaState>(VolcaStoreCreator)
