// MIDI transmission expands 7 x 8bit bytes into 8 x 7bit bytes with a leading
  // 0, so we need to convert this back group by group.
  // Input:
  // MIDI DATA ( 1Set = 7bit x 8Byte )
  //    b7b7b7b7b7b7b7     b6    ~     b0     b6 ~~    b0     b6    ~     b0
  // +-+-+-+-+-+-+-+-+  +-+-+-+-+-+-+-+-+  +-+-+-~~-+-+-+  +-+-+-+-+-+-+-+-+
  // |0| | | | | | | |  |0| | | | | | | |  |0| |    | | |  |0| | | | | | | |
  // +-+-+-+-+-+-+-+-+  +-+-+-+-+-+-+-+-+  +-+-+-~~-+-+-+  +-+-+-+-+-+-+-+-+
  // 7n+6,5,4,3,2,1,0         7n+0          7n+1 ~~ 7n+5         7n+6
  // Output (normal array of 8 bit bytes)
  // DATA ( 1Set = 8bit x 7Byte )
  // b7     ~      b0   b7     ~      b0   b7   ~~    b0   b7     ~      b0
  // +-+-+-+-+-+-+-+-+  +-+-+-+-+-+-+-+-+  +-+-+-~~-+-+-+  +-+-+-+-+-+-+-+-+
  // | | | | | | | | |  | | | | | | | | |  | | |    | | |  | | | | | | | | |
  // +-+-+-+-+-+-+-+-+  +-+-+-+-+-+-+-+-+  +-+-+-~~-+-+-+  +-+-+-+-+-+-+-+-+
  //       7n+0               7n+1          7n+2 ~~ 7n+5         7n+6
  const convert7to8bit = (inputData) => {
    const convertedData = [];
    let count = 0;
    let highBits = 0;
    for (let i = 0; i < inputData.length; i++) {
      const pos = i % 8; // relative position in this group of 8 bytes
      if (pos == 0) { // first byte
        highBits = inputData[i];
      } else {
        let highBit = highBits & (1 << (pos - 1));
        highBit <<= (8 - pos); // shift it to the high bit
        convertedData[count++] = inputData[i] | highBit;
      }
    }
    return convertedData; 
  }

  export { convert7to8bit }