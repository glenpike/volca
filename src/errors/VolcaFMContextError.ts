class VolcaFMContextError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VolcaFMContextError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VolcaFMContextError);
    }
    Object.setPrototypeOf(this, VolcaFMContextError.prototype)
  }
}

export default VolcaFMContextError