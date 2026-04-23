import sharp from 'sharp'
import exifReader from 'exif-reader'
import { v2 as cloudinary } from 'cloudinary'
import { autoTag } from '../utils/auto-tag.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const filename = query.filename || 'photo.jpg'
    const caption = query.caption || ''
    const tags = query.tags || ''
    const takenAtQuery = query.takenAt || ''
    const body = await readRawBody(event, false)

    if (!body || body.length < 100) {
      return { success: false, error: 'No image data received' }
    }

    const publicId = `foto/${Date.now()}-${filename.replace(/\.[^.]+$/, '')}`

    let takenAt = await extractTakenAt(body)
    if (!takenAt && takenAtQuery) {
      const d = new Date(takenAtQuery)
      if (!isNaN(d.getTime())) takenAt = d.toISOString()
    }
    const webp = await sharp(body).webp({ quality: 85 }).toBuffer()

    const userTags = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    const vocab = await getTagVocabulary()
    const aiTags = await autoTag(webp, vocab, caption)
    const finalTags = [...new Set([...userTags, ...aiTags])]

    const context = {}
    if (caption) context.caption = caption
    if (takenAt) context.takenAt = takenAt

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'image',
          format: 'webp',
          ...(Object.keys(context).length ? { context } : {}),
          ...(finalTags.length ? { tags: finalTags } : {}),
        },
        (error, result) => (error ? reject(error) : resolve(result))
      ).end(webp)
    })

    return {
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      size: body.length,
      takenAt,
      tags: finalTags,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
})
