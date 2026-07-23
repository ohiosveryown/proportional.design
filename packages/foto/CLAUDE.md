# Foto - Furniture Photo Gallery

## Project Overview

Furniture photo gallery web app built with Nuxt 4, deployed on Vercel.
Photos uploaded via Raycast (`packages/foto-raycast`), iOS/macOS Shortcuts, and CLI.

## Current Stack

- **Framework**: Nuxt 4
- **Deployment**: Vercel
- **Storage**: Cloudinary
- **Domain**: proportional.design

## How Photo Upload Works

1. Client (Raycast, Shortcuts, or CLI) POSTs raw image binary to `/api/upload-photo`
2. Requires `Authorization: Bearer <GALLERY_SECRET>` (same secret as delete/update)
3. Query params: `filename`, optional `caption`, optional `tags` (comma-separated), optional `takenAt`
4. API converts to WebP (quality 85) via Sharp, auto-tags via Claude vision, uploads to Cloudinary
5. Date (`takenAt`) is taken from EXIF when present; `takenAt` query is a fallback

### Raycast

- Extension: `packages/foto-raycast` (run `npm install && npm run dev` from that folder)
- Preferences: API Base URL (`https://fotos.proportional.design`) + Shared Secret (`GALLERY_SECRET`)
- Command "Upload Photo": Finder selection prefills the file picker; form asks for caption + optional tags

### iOS Shortcuts

Share Sheet shortcut "Fotos" must send the Bearer header after auth was added. Resizes to ~1000px wide, then POSTs the binary with `?filename=…`.

## Current API Endpoints

- POST /api/upload-photo - Bearer auth; raw image body; converts to WebP; auto-tags via Claude vision (strict vocabulary — only reuses existing Cloudinary tags, never invents); uploads to Cloudinary
- GET /api/photos - lists all photos from Cloudinary (folder: foto/)
- DELETE /api/delete-photo - deletes a photo by public_id, requires GALLERY_SECRET password
- PATCH /api/update-photo - updates caption/tags/takenAt, requires GALLERY_SECRET password

## Environment Variables

- CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
- CLOUDINARY_API_KEY - Cloudinary API key
- CLOUDINARY_API_SECRET - Cloudinary API secret
- ANTHROPIC_API_KEY - Claude API key for auto-tagging on upload (optional; auto-tagging no-ops if unset)
- GALLERY_SECRET - shared secret for upload (Bearer), delete, and update

## Planned Features (not yet built)

- ~~Sidecar JSON metadata (caption, tags)~~
- Links section

## Key Files

- server/api/upload-photo.post.js - upload handler (Sharp WebP conversion + Cloudinary)
- server/api/photos.get.js - list photos from Cloudinary
- server/api/delete-photo.delete.js - delete photo from Cloudinary
- app/app.vue - gallery frontend (lightbox, wiggle/delete mode)
- nuxt.config.ts - Nuxt config with Vercel preset

## Rendering / performance (nuxt.config.ts routeRules)

- `/` is prerendered to a static CDN file (`routeRules: { '/': { prerender: true } }`).
  This cut homepage TTFB from ~534ms (serverless cold start) to ~63ms. Photos still
  load live because they're fetched client-side via `useLazyFetch('/api/photos')` —
  prerendering only freezes the shell + static meta, not gallery content. Editing the
  title/OG/JSON-LD meta requires a redeploy for the static HTML to update.
- `/photo/**` uses ISR (`{ isr: true }`) so growing/unknown photo slugs get server-rendered
  on first hit then edge-cached (deep links / refresh work).
- `experimental.payloadExtraction: false` is REQUIRED. Prerendering auto-enables payload
  extraction, which makes every client-side navigation fetch `<route>/_payload.json` first.
  For photo pages that round-trip hit the ISR function and added a ~400ms stall when opening
  a photo. Disabling it inlines the homepage payload into the HTML and restores instant
  client-side photo navigation. Don't re-enable it without re-testing photo-open latency.

### Known limitation: no per-photo social previews

`GalleryView.vue` sets per-photo OG/`useHead` meta, but photo data comes from the
client-side `useLazyFetch('/api/photos')` (non-blocking), so it's empty at server/ISR
render time. Crawlers hitting `/photo/[slug]` get the generic site OG image/title, not the
specific photo. To enable rich per-photo link unfurls, the photo data would need to be
available at server-render time (e.g. blocking fetch or passing the single photo server-side).

## Notes

- Using Nuxt 4 (compatibilityDate: 2025-07-15)
- nitro preset: 'vercel' in nuxt.config.ts
- Images converted to WebP (quality 85) on upload via Sharp
- Long-press on any photo activates iOS-style wiggle/delete mode; tap outside grid to exit
- Delete requires password; optimistic UI removes photo immediately on submit
