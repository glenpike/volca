import { parseSettingsBytes, packSettingsData } from "./parseSettings";
import { sequenceSettingsBytes } from "../../../test/sequenceBytes"
import { sequenceSettings } from "../../../test/sequenceObjects"

describe('Settings', () => {
  test('Converts from bytes correctly', () => {
    const settings = parseSettingsBytes(sequenceSettingsBytes)
    expect(JSON.stringify(settings)).toEqual(JSON.stringify(sequenceSettings))
  });
  
  test('Converts to bytes correctly', () => {
    const settingsBytes = packSettingsData(sequenceSettings)
    expect(settingsBytes).toEqual(sequenceSettingsBytes)
  });
})
