export function slugFromCaption(caption) {
  if (!caption?.trim()) return ''
  return caption
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function fallbackSlugFromPublicId(publicId) {
  return String(publicId).replace(/^foto\//, '')
}

export function resolveUniqueSlug(base, usedSlugs) {
  const normalized = base?.trim() || 'photo'
  if (!usedSlugs.has(normalized)) return normalized
  let n = 2
  while (usedSlugs.has(`${normalized}-${n}`)) n++
  return `${normalized}-${n}`
}

export function assignPhotoSlugs(photos) {
  const used = new Set()
  return photos.map((photo) => {
    const base =
      photo.slug?.trim() ||
      slugFromCaption(photo.caption) ||
      fallbackSlugFromPublicId(photo.filename)
    const slug = resolveUniqueSlug(base, used)
    used.add(slug)
    return { ...photo, slug }
  })
}

export function computePhotoSlug({ publicId, caption, existingPhotos }) {
  const used = new Set(
    existingPhotos
      .filter((p) => p.filename !== publicId)
      .map((p) => p.slug),
  )
  const base =
    slugFromCaption(caption) || fallbackSlugFromPublicId(publicId)
  return resolveUniqueSlug(base, used)
}
