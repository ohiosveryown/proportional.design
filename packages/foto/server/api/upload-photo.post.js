import sharp from 'sharp'
import exifReader from 'exif-reader'
import { v2 as cloudinary } from 'cloudinary'
import { computePhotoSlug } from '#shared/photo-slug.js'
import { autoTag } from '../utils/auto-tag.js'
import { listPhotos, invalidatePhotoCache } from '../utils/list-photos.js'
import { invalidateStoryCache } from '../utils/list-stories.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const DESTINATIONS = new Set(['gallery', 'story', 'both'])

let vocabCache = { at: 0, tags: [] }
const VOCAB_TTL_MS = 5 * 60 * 1000

async function getTagVocabulary() {
  if (Date.now() - vocabCache.at < VOCAB_TTL_MS) return vocabCache.tags
  try {
    const res = await cloudinary.api.tags({ max_results: 500 })
    vocabCache = { at: Date.now(), tags: res.tags || [] }
  } catch (e) {
    console.error('Tag vocab fetch failed:', e)
  }
  return vocabCache.tags
}

async function extractTakenAt(body) {
  try {
    const meta = await sharp(body).metadata()
    if (!meta.exif) return ''
    const exif = exifReader(meta.exif)
    const date = exif?.Photo?.DateTimeOriginal || exif?.Image?.DateTime
    if (!date) return ''
    return new Date(date).toISOString()
  } catch {
    return ''
  }
}

function uploadWebp(publicId, webp, { context = {}, tags = [] } = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          resource_type: 'image',
          format: 'webp',
          ...(Object.keys(context).length ? { context } : {}),
          ...(tags.length ? { tags } : {}),
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      .end(webp)
  })
}

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization') || ''
  const provided = auth.replace(/^Bearer\s+/i, '').trim()
  if (!process.env.GALLERY_SECRET || provided !== process.env.GALLERY_SECRET) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const query = getQuery(event)
    const filename = query.filename || 'photo.jpg'
    const caption = query.caption || ''
    const tags = query.tags || ''
    const takenAtQuery = query.takenAt || ''
    const rawDestination = String(query.destination || 'gallery').toLowerCase()
    const destination = DESTINATIONS.has(rawDestination)
      ? rawDestination
      : 'gallery'
    const toGallery = destination === 'gallery' || destination === 'both'
    const toStory = destination === 'story' || destination === 'both'
    const body = await readRawBody(event, false)

    if (!body || body.length < 100) {
      return { success: false, error: 'No image data received' }
    }

    const baseName = `${Date.now()}-${filename.replace(/\.[^.]+$/, '')}`

    let takenAt = await extractTakenAt(body)
    if (!takenAt && takenAtQuery) {
      const d = new Date(takenAtQuery)
      if (!isNaN(d.getTime())) takenAt = d.toISOString()
    }
    const webp = await sharp(body).webp({ quality: 85 }).toBuffer()

    const baseContext = {}
    if (caption) baseContext.caption = caption
    if (takenAt) baseContext.takenAt = takenAt

    let galleryResult = null
    let storyResult = null
    let slug = ''
    let finalTags = []

    if (toGallery) {
      const userTags = tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      const vocab = await getTagVocabulary()
      const aiTags = await autoTag(webp, vocab, caption)
      finalTags = [...new Set([...userTags, ...aiTags])]

      const publicId = `foto/${baseName}`
      const existingPhotos = await listPhotos({ force: true })
      slug = computePhotoSlug({
        publicId,
        caption,
        existingPhotos,
      })

      galleryResult = await uploadWebp(publicId, webp, {
        context: { ...baseContext, slug },
        tags: finalTags,
      })
    }

    if (toStory) {
      const publicId = `foto-stories/${baseName}`
      storyResult = await uploadWebp(publicId, webp, {
        context: baseContext,
      })
    }

    if (toGallery) invalidatePhotoCache()
    if (toStory) invalidateStoryCache()

    return {
      success: true,
      destination,
      url: galleryResult?.secure_url || storyResult?.secure_url,
      filename: galleryResult?.public_id || storyResult?.public_id,
      slug: slug || undefined,
      size: body.length,
      takenAt,
      tags: finalTags,
      ...(galleryResult
        ? {
            gallery: {
              url: galleryResult.secure_url,
              filename: galleryResult.public_id,
              slug,
            },
          }
        : {}),
      ...(storyResult
        ? {
            story: {
              url: storyResult.secure_url,
              filename: storyResult.public_id,
            },
          }
        : {}),
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
})
