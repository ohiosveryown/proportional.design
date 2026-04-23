import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default defineEventHandler(async (event) => {
  try {
    const { publicId, caption, tags, takenAt, password } = await readBody(event)

    if (!password || password !== process.env.GALLERY_SECRET) {
      return { success: false, error: 'Incorrect password' }
    }

    const context = { caption: caption ?? '' }
    if (takenAt) context.takenAt = takenAt

    await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      context,
      tags: Array.isArray(tags) ? tags : [],
    })

    return { success: true }
  } catch (error) {
    console.error('Update photo error:', error)
    return { success: false, error: error.message }
  }
})
