export default function isValidJSON(string: string) {
  try {
    JSON.parse(string)
    return true
  } catch {
    return false
  }
}
