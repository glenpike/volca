import { act } from '@testing-library/react'
import type * as ZustandExportedTypes from 'zustand'
export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  jest.requireActual<typeof ZustandExportedTypes>('zustand')

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  // to support curried version of create
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// when creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  // to support curried version of createStore
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof ZustandExportedTypes.createStore


/**
 * FIXME:
 * This doesn't play nice with our mockUseVolcaStore because
 * it calls afterEach in the 'render' loop, so we have to
 * specifically unmock zustand in each component test that
 * uses it.
 *
 * See if we can configure Jest not to 'automock' and
 * specifically mock zustand in our store tests?
 */
// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
