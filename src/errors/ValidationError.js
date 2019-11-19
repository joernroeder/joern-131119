export const ValidationErrorCodes = {
  INVALID_DATA_FORMAT: 1,
  DUPLICATE_ENTRY: 2,
}

class ValidationError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
  }
}

export default ValidationError
