export function toStorySlug(story) {
  const id = String(story?.id || '')
  return id
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

export function storyPath(story) {
  return `/story/${toStorySlug(story)}`
}

/** Normalize `/story/[...id]` param (string or array) to the story id. */
export function storyIdFromRouteParam(param) {
  if (param == null || param === '') return ''
  const parts = Array.isArray(param) ? param : [param]
  return parts.map((p) => decodeURIComponent(String(p))).join('/')
}

export function findStoryByRouteId(stories, param) {
  const id = storyIdFromRouteParam(param)
  if (!id) return null
  return stories.find((s) => s.id === id) || null
}

export function isCanonicalStoryPath(story, path) {
  return path === storyPath(story)
}
