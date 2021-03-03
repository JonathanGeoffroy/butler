export enum ContentType {
  JSON,
  TEXT,
  APPLICATION,
  ANY
}

function normalize(string: string) {
  return string.trim().toLowerCase()
}
export function find(
  key: string,
  headers: Record<string, string>
): string | null {
  const search = normalize(key)
  const realKey = Object.keys(headers).find((k) => normalize(k) === search)

  return realKey ? normalize(headers[realKey]) : null
}

export function findContentType(headers: Record<string, string>): ContentType {
  const contentType = find('content-type', headers)

  if (!contentType) {
    return ContentType.ANY
  }

  if (contentType.includes('application/json')) {
    return ContentType.JSON
  }

  if (contentType.includes('application/')) {
    return ContentType.APPLICATION
  }

  if (contentType.includes('text/')) {
    return ContentType.TEXT
  }

  return ContentType.ANY
}
