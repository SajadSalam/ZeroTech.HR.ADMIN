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
export const isNullOrEmpty = (str: string | null | undefined) => {
  return str == null || str == '' || str == undefined
}

/**
 * Compares two JSON objects and returns the keys that have different values
 * @param oldObj - The old JSON object (can be a JSON string or object)
 * @param newObj - The new JSON object (can be a JSON string or object)
 * @returns An object with changed keys, each containing oldValue and newValue
 */
export const getChanges = (
  oldObj: string | object | null,
  newObj: string | object | null
): Record<string, { oldValue: any; newValue: any }> => {

  // Fast check: if both are strings and exactly equal → no changes
  if (typeof oldObj === "string" && typeof newObj === "string" && oldObj === newObj) {
    return {}
  }
  
  const oldParsed = JSON.parse(oldObj as string)
  const newParsed = JSON.parse(newObj as string)

  // Collect changes
  const keys = new Set([...Object.keys(oldParsed), ...Object.keys(newParsed)])
  const changes: Record<string, { oldValue: any; newValue: any }> = {}

  for (const key of keys) {
    if (JSON.stringify(oldParsed[key]) !== JSON.stringify(newParsed[key])) {
      changes[key] = {
        oldValue: oldParsed[key],
        newValue: newParsed[key]
      }
    }
  }

  return changes
}
