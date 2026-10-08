import { v2 as cloudinary } from 'cloudinary'
import { decodeContextValue } from './context-value.js'

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

function mapResource(r) {
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
    caption: decodeContextValue(r.context?.custom?.caption || ''),
    storyId: decodeContextValue(r.context?.custom?.storyId || ''),
    storyName: decodeContextValue(r.context?.custom?.storyName || ''),
    tags: r.tags || [],
    isNew: isNew(r.created_at),
  }
}

function groupStories(items) {
  const groups = new Map()

  for (const item of items) {
    const id = item.storyId || item.filename
    const name =
      item.storyName || item.caption || 'Untitled story'
    let group = groups.get(id)
    if (!group) {
      group = {
        id,
        name,
        thumbUrl: item.thumbUrl,
        uploadedAt: item.uploadedAt,
        isNew: item.isNew,
        items: [],
      }
      groups.set(id, group)
    }
    group.items.push(item)
    if (item.storyName) group.name = item.storyName
    else if (!item.storyId && item.caption && group.items.length === 1) {
      group.name = item.caption
    }
    const uploaded = new Date(item.uploadedAt).getTime()
    const groupUploaded = new Date(group.uploadedAt).getTime()
    if (uploaded > groupUploaded) {
      group.uploadedAt = item.uploadedAt
      group.thumbUrl = item.thumbUrl
    }
    if (item.isNew) group.isNew = true
  }

  for (const group of groups.values()) {
    group.items.sort((a, b) => {
      const aT = new Date(a.takenAt || a.uploadedAt).getTime()
      const bT = new Date(b.takenAt || b.uploadedAt).getTime()
      return aT - bT
    })
    const first = group.items[0]
    if (first && !group.thumbUrl) group.thumbUrl = first.thumbUrl
  }

  return [...groups.values()].sort((a, b) => {
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  })
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

  const stories = groupStories(resources.map(mapResource))
  storyCache = { at: Date.now(), stories }
  return stories
}
