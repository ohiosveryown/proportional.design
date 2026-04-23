import { listPhotos } from '../utils/list-photos.js'

export default defineEventHandler(async () => {
  try {
    const photos = await listPhotos()
    return { success: true, count: photos.length, photos }
  } catch (error) {
    console.error('List photos error:', error)
    return { success: false, error: error.message }
  }
})
