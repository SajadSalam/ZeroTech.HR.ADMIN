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

/**
 * Formats a date to ISO 8601 format with local timezone offset
 * @param date - The date to format (Date object or date string)
 * @returns Formatted date string like "2025-12-15T11:29:00+03:00"
 * @example
 * formatDateWithTimezone(new Date()) // "2025-12-15T11:29:00+03:00"
 * formatDateWithTimezone("2025-12-15T11:29:00") // "2025-12-15T11:29:00+03:00"
 */
export const formatDateWithTimezone = (date: Date | string): string => {
  const dateObj = new Date(date)
  const offset = -dateObj.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
  
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hour = String(dateObj.getHours()).padStart(2, '0')
  const minute = String(dateObj.getMinutes()).padStart(2, '0')
  const second = String(dateObj.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`
}
