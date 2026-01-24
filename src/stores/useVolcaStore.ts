import { create } from 'zustand'
import { VolcaState } from '../types'
import { VolcaStoreCreator } from '../shared/VolcaStoreCreator'

export { CURRENT_VOLCA_SEQUENCE_INDEX } from '../shared/VolcaStoreCreator'

export const useVolcaStore = create<VolcaState>(VolcaStoreCreator)
