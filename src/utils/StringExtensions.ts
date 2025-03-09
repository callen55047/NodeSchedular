function isValid(str?: string): boolean {
  return str !== undefined &&
    str !== null &&
    str.length > 0
}

function normalizeEmail(str: string): string {
  // TODO: check for @ character, etc.
  return str.trim()
}

export {
  isValid,
  normalizeEmail
}