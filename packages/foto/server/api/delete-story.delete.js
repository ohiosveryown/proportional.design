import { v2 as cloudinary } from 'cloudinary'
import { listStories, invalidateStoryCache } from '../utils/list-stories.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default defineEventHandler(async (event) => {
  try {
    const { storyId, password } = await readBody(event)

    if (!password || password !== process.env.GALLERY_SECRET) {
      return { success: false, error: 'Incorrect password' }
    }
    if (!storyId) {
      return { success: false, error: 'Missing story' }
    }

    const stories = await listStories({ force: true })
    const story = stories.find((s) => s.id === storyId)
    if (!story) {
      return { success: false, error: 'Story not found' }
    }

    // Only destroy foto-stories/ assets — never touch gallery foto/ copies.
    const destroyed = []
    for (const item of story.items) {
      if (!item.filename?.startsWith('foto-stories/')) continue
      const result = await cloudinary.uploader.destroy(item.filename, {
        resource_type: item.resource_type === 'video' ? 'video' : 'image',
      })
      if (result.result === 'ok' || result.result === 'not found') {
        destroyed.push(item.filename)
      }
    }

    if (!destroyed.length) {
      return { success: false, error: 'Failed to delete story' }
    }

    invalidateStoryCache()
    return { success: true, deleted: destroyed }
  } catch (error) {
    console.error('Delete story error:', error)
    return { success: false, error: error.message }
  }
})
