import { listPhotos } from '../utils/list-photos.js'

export default defineEventHandler(async (event) => {
  try {
    const photos = await listPhotos()
    setHeader(
      event,
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    )
    return { success: true, count: photos.length, photos }
  } catch (error) {
    console.error('List photos error:', error)
    return { success: false, error: error.message }
  }
})
