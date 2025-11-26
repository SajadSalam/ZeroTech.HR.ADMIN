export const toShortString = (str: string, len: number, extension?: string) => {
  return str.length > len ? str.substring(0, len) + (extension ?? '...') : str
}
export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
export const isNullOrEmpty = (str: string | null) => {
  return str == null || str == '' || str == undefined
}

/**
 * Compares two JSON objects and returns the keys that have different values
 * @param oldObj - The old JSON object (can be a JSON string or object)
 * @param newObj - The new JSON object (can be a JSON string or object)
 * @returns An object with changed keys, each containing oldValue and newValue
 */
export const getChanges = (oldObj: string | object | null, newObj: string | object | null): Record<string, { oldValue: any; newValue: any }> => {
  // Parse JSON strings if needed
  let oldParsed: Record<string, any> = {}
  let newParsed: Record<string, any> = {}

  try {
    if (typeof oldObj === 'string') {
      oldParsed = oldObj ? JSON.parse(oldObj) : {}
    } else if (oldObj && typeof oldObj === 'object') {
      oldParsed = oldObj as Record<string, any>
    }
  } catch (e) {
    console.error('Error parsing oldValues:', e)
    oldParsed = {}
  }

  try {
    if (typeof newObj === 'string') {
      newParsed = newObj ? JSON.parse(newObj) : {}
    } else if (newObj && typeof newObj === 'object') {
      newParsed = newObj as Record<string, any>
    }
  } catch (e) {
    console.error('Error parsing newValues:', e)
    newParsed = {}
  }

  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(oldParsed), ...Object.keys(newParsed)])
  const changes: Record<string, { oldValue: any; newValue: any }> = {}

  // Compare each key
  for (const key of allKeys) {
    const oldValue = oldParsed[key]
    const newValue = newParsed[key]

    // Check if values are different (using deep comparison for objects/arrays)
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = {
        oldValue: oldValue,
        newValue: newValue
      }
    }
  }

  return changes
}