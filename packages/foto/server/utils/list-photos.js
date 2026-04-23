import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const PINNED_ID = 'foto/1776966461078-sq@2x'
const PINNED_LIGHTBOX_URL =
  'https://res.cloudinary.com/dnxxsspmw/image/upload/v1776971496/og-image_2x_nogug8.webp'
const PINNED_THUMB_URL =
  'https://res.cloudinary.com/dnxxsspmw/image/upload/v1776971535/foto/1776966461078-sq%402x.webp'

export async function listPhotos() {
  const [images, videos] = await Promise.all([
    cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'foto/',
      max_results: 500,
      direction: -1,
      context: true,
      tags: true,
    }),
    cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      prefix: 'foto/',
      max_results: 500,
      direction: -1,
      context: true,
      tags: true,
    }),
  ])

  return [...images.resources, ...videos.resources]
    .map((r) => {
      const isPinned = r.public_id === PINNED_ID
      const url = isPinned ? PINNED_LIGHTBOX_URL : r.secure_url
      const thumbSource = isPinned ? PINNED_THUMB_URL : r.secure_url
      const thumbUrl =
        r.resource_type === 'video'
          ? thumbSource
              .replace('/video/upload/', '/video/upload/so_0/')
              .replace(/\.\w+$/, '.jpg')
          : thumbSource.replace(
              '/upload/',
              '/upload/c_limit,w_600,q_auto,f_auto/',
            )
      return {
        url,
        thumbUrl,
        resource_type: r.resource_type,
        width: r.width,
        height: r.height,
        filename: r.public_id,
        size: r.bytes,
        uploadedAt: r.created_at,
        takenAt: r.context?.custom?.takenAt || r.created_at,
        caption: r.context?.custom?.caption || '',
        tags: r.tags || [],
      }
    })
    .sort((a, b) => {
      if (a.filename === PINNED_ID) return -1
      if (b.filename === PINNED_ID) return 1
      const aT = new Date(a.takenAt || a.uploadedAt).getTime()
      const bT = new Date(b.takenAt || b.uploadedAt).getTime()
      return bT - aT
    })
}
