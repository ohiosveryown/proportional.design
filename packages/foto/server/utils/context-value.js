/**
 * Cloudinary context must be valid UTF-8, but 4-byte chars (emoji) often
 * fail with "Invalid encoding in context". Store non-ASCII as `enc:` +
 * encodeURIComponent so the wire value stays ASCII; decode on read.
 */

export function encodeContextValue(value) {
  if (value == null || value === '') return value
  const s = String(value)
  if (!/[^\x00-\x7F]/.test(s)) return s
  return `enc:${encodeURIComponent(s)}`
}

export function decodeContextValue(value) {
  if (value == null || value === '') return ''
  const s = String(value)
  if (!s.startsWith('enc:')) return s
  try {
    return decodeURIComponent(s.slice(4))
  } catch {
    return s.slice(4)
  }
}

/** Encode string fields on a context object for Cloudinary upload/explicit. */
export function encodeContext(context = {}) {
  const out = {}
  for (const [key, value] of Object.entries(context)) {
    if (value == null || value === '') continue
    out[key] = typeof value === 'string' ? encodeContextValue(value) : value
  }
  return out
}
