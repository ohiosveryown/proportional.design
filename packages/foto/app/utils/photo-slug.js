import {
  fallbackSlugFromPublicId,
  slugFromCaption,
} from '#shared/photo-slug.js'

export { slugFromCaption, fallbackSlugFromPublicId }

export function toPhotoSlug(photo) {
  return encodeURIComponent(photo.slug)
}

export function photoPath(photo) {
  return `/photo/${toPhotoSlug(photo)}`
}

export function legacyFilenameFromSlug(slug) {
  const decoded = decodeURIComponent(String(slug))
  return decoded.startsWith('foto/') ? decoded : `foto/${decoded}`
}

export function findPhotoByRouteSlug(photos, slug) {
  if (!slug) return null
  const decoded = decodeURIComponent(String(slug))

  const bySlug = photos.find((p) => p.slug === decoded)
  if (bySlug) return bySlug

  const legacyFilename = legacyFilenameFromSlug(decoded)
  return photos.find((p) => p.filename === legacyFilename) || null
}

export function isCanonicalPhotoPath(photo, path) {
  return path === photoPath(photo)
}
