# Foto - Personal Photo Gallery

## Project Overview

Personal photo gallery web app built with Nuxt 4, deployed on Vercel.
Photos uploaded from iPhone via iOS Shortcuts Share Sheet.

## Current Stack

- **Framework**: Nuxt 4
- **Deployment**: Vercel (foto-five-livid.vercel.app)
- **Storage**: Cloudinary (folder: `foto/`)
- **Domain**: fotos.proportional.design

## How Photo Upload Works

1. iPhone Shortcuts Share Sheet shortcut called "Fotos"
2. Resizes image to 1000px wide
3. POSTs raw image binary to /api/upload-photo
4. Filename passed as query param: ?filename=IMG_1234.jpg
5. API converts to WebP (quality 85) via Sharp, uploads to Cloudinary, returns public URL

## Current API Endpoints

- POST /api/upload-photo - receives raw image, converts to WebP, auto-tags via Claude vision (strict vocabulary — only reuses existing Cloudinary tags, never invents), uploads to Cloudinary
- GET /api/photos - lists all photos from Cloudinary (folder: foto/)
- DELETE /api/delete-photo - deletes a photo by public_id, requires GALLERY_SECRET password

## Environment Variables

- CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
- CLOUDINARY_API_KEY - Cloudinary API key
- CLOUDINARY_API_SECRET - Cloudinary API secret
- ANTHROPIC_API_KEY - Claude API key for auto-tagging on upload (optional; auto-tagging no-ops if unset)
- Password required to delete photos

## Planned Features (not yet built)

- Sidecar JSON metadata (caption, tags)
- Links section

## Key Files

- server/api/upload-photo.post.js - upload handler (Sharp WebP conversion + Cloudinary)
- server/api/photos.get.js - list photos from Cloudinary
- server/api/delete-photo.delete.js - delete photo from Cloudinary
- app/app.vue - gallery frontend (lightbox, wiggle/delete mode)
- nuxt.config.ts - Nuxt config with Vercel preset

## Notes

- Using Nuxt 4 (compatibilityDate: 2025-07-15)
- nitro preset: 'vercel' in nuxt.config.ts
- Images converted to WebP (quality 85) on upload via Sharp
- Long-press on any photo activates iOS-style wiggle/delete mode; tap outside grid to exit
- Delete requires password; optimistic UI removes photo immediately on submit
