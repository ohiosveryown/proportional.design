import { v2 as cloudinary } from 'cloudinary'
import { listStories, invalidateStoryCache } from '../utils/list-stories.js'
import { encodeContext } from '../utils/context-value.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      publicId,
      storyId,
      password,
      resource_type,
      caption = '',
      takenAt = '',
    } = body || {}

    if (!password || password !== process.env.GALLERY_SECRET) {
      return { success: false, error: 'Incorrect password' }
    }
    if (!publicId || !storyId) {
      return { success: false, error: 'Missing photo or story' }
    }
    if (resource_type === 'video') {
      return { success: false, error: 'Videos cannot be added to stories yet' }
    }

    const stories = await listStories({ force: true })
    const story = stories.find((s) => s.id === storyId)
    if (!story) {
      return { success: false, error: 'Story not found' }
    }

    const storyName = story.name || 'Untitled story'
    const stableStoryId = story.id

    // Stamp existing items so future uploads group with them.
    for (const item of story.items) {
      if (item.storyId === stableStoryId && item.storyName === storyName) continue
      const ctx = encodeContext({
        caption: item.caption || '',
        storyId: stableStoryId,
        storyName,
        ...(item.takenAt ? { takenAt: item.takenAt } : {}),
      })
      await cloudinary.uploader.explicit(item.filename, {
        type: 'upload',
        resource_type: 'image',
        context: ctx,
      })
    }

    const source = await cloudinary.api.resource(publicId, {
      resource_type: 'image',
      type: 'upload',
    })

    const baseName = `${Date.now()}-${publicId.split('/').pop().replace(/\.[^.]+$/, '')}`
    const context = encodeContext({
      storyId: stableStoryId,
      storyName,
      ...(caption ? { caption } : {}),
      ...(takenAt ? { takenAt } : {}),
    })

    const result = await cloudinary.uploader.upload(source.secure_url, {
      public_id: `foto-stories/${baseName}`,
      resource_type: 'image',
      format: 'webp',
      context,
      tags: Array.isArray(source.tags) ? source.tags : [],
    })

    invalidateStoryCache()
    return {
      success: true,
      storyId: stableStoryId,
      storyName,
      filename: result.public_id,
      url: result.secure_url,
    }
  } catch (error) {
    console.error('Add to story error:', error)
    return { success: false, error: error.message }
  }
})
