import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const CACHE_TTL_MS = 60 * 1000
const NEW_MS = 24 * 60 * 60 * 1000
let storyCache = { at: 0, stories: null }

export function invalidateStoryCache() {
  storyCache = { at: 0, stories: null }
}

function isNew(uploadedAt) {
  if (!uploadedAt) return false
  const t = new Date(uploadedAt).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() - t < NEW_MS
}

export async function listStories({ force = false } = {}) {
  if (!force && storyCache.stories && Date.now() - storyCache.at < CACHE_TTL_MS) {
    return storyCache.stories
  }

  let resources = []
  try {
    const images = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'foto-stories/',
      max_results: 500,
      direction: -1,
      context: true,
      tags: true,
    })
    resources = images.resources || []
  } catch (e) {
    // Empty / missing folder should not break the gallery shell.
    if (e?.http_code !== 404 && e?.error?.http_code !== 404) throw e
  }

  const stories = resources
    .map((r) => {
      const thumbUrl = r.secure_url.replace(
        '/upload/',
        '/upload/c_fill,g_auto,w_200,h_200,q_auto,f_auto/',
      )
      return {
        url: r.secure_url,
        thumbUrl,
        resource_type: r.resource_type,
        width: r.width,
        height: r.height,
        filename: r.public_id,
        size: r.bytes,
        uploadedAt: r.created_at,
        takenAt: r.context?.custom?.takenAt || r.created_at,
        caption: r.context?.custom?.caption || '',
        tags: r.tags || [],
        isNew: isNew(r.created_at),
      }
    })
    .sort((a, b) => {
      const aT = new Date(a.uploadedAt).getTime()
      const bT = new Date(b.uploadedAt).getTime()
      return bT - aT
    })

  storyCache = { at: Date.now(), stories }
  return stories
}
