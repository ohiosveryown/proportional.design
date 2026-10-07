/** Stable-ish id from a display name for new stories. */
export function storyIdFromName(name) {
  const base = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return base || `story-${Date.now()}`
}
