import _ from 'lodash'

const isNullOrEmpty = (array: any[] | undefined | null): boolean => {
  return !array || array.length < 1
}

function objectIsNotEmpty(obj: any): boolean {
  return Object.values(obj).some(value => {
    return value !== null && value !== undefined
  })
}

function firstOrNull<Type>(arr: Type[] | undefined | null): Type | null {
  if (!isNullOrEmpty(arr))
    return arr![0]

  return null
}

function lastOrNone<Type>(arr: Type[]): Type | undefined {
  if (arr.length > 0) {
    return arr[arr.length - 1]
  }

  return undefined
}

const isObjNullOrEmpty = (obj: {} | undefined | null): boolean => {
  return !obj || Object.keys(obj).length < 1
}

interface IDuplicateComparable {
  _id: string,
  updated_at: string
}

function removeDuplicatesBasedOnUpdatedAt<T>(arr: T[]): T[] {
  const uniqueMap = new Map<string, T>();

  (arr as IDuplicateComparable[]).forEach((item: IDuplicateComparable) => {
    if (!uniqueMap.has(item._id) ||
      new Date(item.updated_at) > new Date((uniqueMap.get(item._id) as IDuplicateComparable)!.updated_at)
    ) {
      uniqueMap.set(item._id, item as T)
    }
  })

  return Array.from(uniqueMap.values())
}

function removeDuplicatesBasedOnId<T>(base: T[], addition: T[]): T[] {
  const combined = [...base, ...addition]
  return _.uniqBy(combined, (c) => (c as IDuplicateComparable)._id) as T[]
}

function moveItemForward<T>(arr: T[], index: number): T[] {
  if (index > 0 && index < arr.length) {
    const temp = arr[index]
    arr[index] = arr[index - 1]
    arr[index - 1] = temp
  }
  return arr
}

function moveItemBackward<T>(arr: T[], index: number): T[] {
  if (index >= 0 && index < arr.length - 1) {
    const temp = arr[index]
    arr[index] = arr[index + 1]
    arr[index + 1] = temp
  }
  return arr
}

function orderByCreatedAt<T>(list: T[]): T[] {
  return list.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)

    if (dateA < dateB) {
      return -1
    } else if (dateA > dateB) {
      return 1
    } else {
      return 0
    }
  })
}

function getDiff<T>(obj1: T, obj2: T): Partial<T> {
  const differences: Partial<T> = {}

  for (const key in obj1) {
    if (obj1[key as keyof T] !== obj2[key as keyof T]) {
      differences[key as keyof T] = obj2[key as keyof T]
    }
  }

  return differences
}

export {
  isNullOrEmpty,
  isObjNullOrEmpty,
  firstOrNull,
  lastOrNone,
  removeDuplicatesBasedOnUpdatedAt,
  removeDuplicatesBasedOnId,
  moveItemForward,
  moveItemBackward,
  orderByCreatedAt,
  objectIsNotEmpty,
  getDiff
}