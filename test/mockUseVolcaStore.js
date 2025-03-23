//https://medium.com/@tts2p4/an-essential-zustand-test-recipe-43e5892d75cb
import { useVolcaStore } from "../src/stores/useVolcaStore"

// first, we turn the useVolcaStore hook into a jest mock
jest.mock("../src/stores/useVolcaStore", () => ({
  useVolcaStore: jest.fn()
}));

// jest.mocked allows us to keep type safety on useVolcaStore's defined types
// when defining mock implementation values
const useVolcaStoreMock = jest.mocked(useVolcaStore);

// we will import this method into our tests, allowing them to specify
// only those store values the test needs to care about
export const mockUseVolcaStore = (
  overrides = {}
) => {
  useVolcaStoreMock.mockImplementation((getterFn) => {
    return getterFn({
      // we include the store's actual values by default
      // this allows the mocked store to have complete functionality,
      // with "granular" mocks defined as specified by tests
      ...jest.requireActual("../src/stores/useVolcaStore").useVolcaStore(),
      ...overrides
    });
  });
};