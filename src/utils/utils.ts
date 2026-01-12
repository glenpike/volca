const checkSum = (data: number[]): number => {
	return (128 - (data.reduce((sum, value) => sum + +value, 0) % 128)) % 128
}

const bytesToHex = (bytes: ArrayLike<number>): string => {
	return Array.from(bytes)
		.reduce((hex, byte) => {
			return hex + `${(byte >>> 4).toString(16)}${(byte & 0xf).toString(16)} `
		}, '')
		.trim()
		.replace(/ /g, ',')
}

const hexToBytes = (hexStr: string): number[] | never => {
	return (hexStr
		.replace(/ /g, '')
		.match(/([a-fA-F0-9]{2})/g) ?? []
	).reduce<number[]>((bytes, byteStr) => {
		const byte = parseInt(byteStr, 16)
		return bytes.concat(byte)
	}, [])
}

export { checkSum, bytesToHex, hexToBytes }
