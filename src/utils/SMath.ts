const SMath = {
  clamp: (value: number | undefined, min: number, max: number): number => {
    const num = value || 0
    return Math.min(Math.max(num, min), max)
  }
}

export default SMath