import { hexToBytes, bytesToHex, checkSum } from './utils';

const hex = '00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F';
const bytes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
describe('hexToBytes', () => {
  test('should convert hex to bytes', () => {
    expect(hexToBytes(hex)).toEqual(bytes);
  });

  test('should work with 0x prefix and commas', () => {
    const hexWithPrefix = '0x' + hex.replace(/ /g, ', ');
    expect(hexToBytes(hexWithPrefix)).toEqual(bytes);
  });
})

describe('bytesToHex', () => {
  test('should convert bytes to hex', () => {
    expect(bytesToHex(bytes)).toEqual(hex.replace(/ /g, ',').toLowerCase());
  });
})

describe('checkSum', () => {
  test('should calculate checksum', () => {
    expect(checkSum(bytes)).toEqual(8);
  });
})