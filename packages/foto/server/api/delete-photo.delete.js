import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default defineEventHandler(async (event) => {
  try {
    const { publicId, password } = await readBody(event)

    if (!password || password !== process.env.GALLERY_SECRET) {
      return { success: false, error: 'Incorrect password' }
    }

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result !== 'ok') {
      return { success: false, error: 'Failed to delete photo' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: error.message }
  }
})
