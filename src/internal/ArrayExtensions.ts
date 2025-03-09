function addUniqueElement<T>(array: T[], element: T): void {
  if (!array.includes(element)) {
    array.push(element);
  }
}

export {
  addUniqueElement
}