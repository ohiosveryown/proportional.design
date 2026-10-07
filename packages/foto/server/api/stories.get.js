import { listStories } from '../utils/list-stories.js'

export default defineEventHandler(async () => {
  try {
    const stories = await listStories()
    return { success: true, count: stories.length, stories }
  } catch (error) {
    console.error('List stories error:', error)
    return { success: false, error: error.message }
  }
})
