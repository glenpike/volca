import Settings from "./Settings";
import { sequenceSettingsBytes } from "../../../../test/sequenceBytes"
import { sequenceSettings } from "../../../../test/sequenceObjects"

describe('Settings', () => {
  test('Converts from bytes correctly', () => {
    const settings = new Settings()
    settings.fromBytes(sequenceSettingsBytes)
    expect(JSON.stringify(settings.settings)).toEqual(JSON.stringify(sequenceSettings))
  });
  
  test('Converts to bytes correctly', () => {
    const settings = new Settings()
    settings.settings = {...sequenceSettings}
    expect(settings.toBytes()).toEqual(sequenceSettingsBytes)
  });
  
  test('toJSON', () => {
    const settings = new Settings()
    settings.fromBytes(sequenceSettingsBytes)
    expect(settings.toJSON()).toEqual(JSON.stringify(sequenceSettings))
  });
})
