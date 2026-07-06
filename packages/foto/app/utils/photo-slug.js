export function toPhotoSlug(filename) {
  return encodeURIComponent(String(filename).replace(/^foto\//, ''))
}

export function fromPhotoSlug(slug) {
  const decoded = decodeURIComponent(String(slug))
  return decoded.startsWith('foto/') ? decoded : `foto/${decoded}`
}

export function photoPath(photo) {
  return `/photo/${toPhotoSlug(photo.filename)}`
}
