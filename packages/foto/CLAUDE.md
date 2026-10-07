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
3. Query params: `filename`, optional `caption`, optional `tags` (comma-separated), optional `takenAt`, optional `destination`
4. API converts to WebP (quality 85) via Sharp, auto-tags via Claude vision (gallery only), uploads to Cloudinary
5. Date (`takenAt`) is taken from EXIF when present; `takenAt` query is a fallback

### Destination (`destination` query param)

| Value | Cloudinary folder | Auto-tag |
| ----- | ----------------- | -------- |
| `gallery` (default) | `foto/` | yes |
| `story` | `foto-stories/` | no (faster phone uploads) |
| `both` | both folders (same WebP, two `public_id`s) | yes on gallery copy only |

Stories persist until manually deleted. `GET /api/stories` includes `isNew` when `uploadedAt` is within the last 24 hours (UI callout TBD).

### Raycast

- Extension: `packages/foto-raycast` (run `npm install && npm run dev` from that folder)
- Preferences: API Base URL (`https://fotos.proportional.design`) + Shared Secret (`GALLERY_SECRET`)
- Command "Upload Photo": Finder selection prefills the file picker; form asks for destination (Gallery / Story / Both), caption + optional tags

### iOS Shortcuts

Share Sheet shortcut "Fotos":

1. Receives image → resize ~1000px wide
2. **Choose from Menu:** Gallery / Story / Both
3. Map choice → `destination=gallery|story|both` query param
4. POST binary with `Authorization: Bearer <GALLERY_SECRET>` and `?filename=…&destination=…`

Must send the Bearer header. Invalid/missing `destination` falls back to `gallery`.

## Current API Endpoints

- POST /api/upload-photo - Bearer auth; raw image body; `destination=gallery|story|both`; converts to WebP; auto-tags gallery uploads via Claude vision (strict vocabulary — only reuses existing Cloudinary tags, never invents); uploads to Cloudinary (`foto/` and/or `foto-stories/`)
- GET /api/photos - lists gallery photos from Cloudinary (folder: `foto/`)
- GET /api/stories - lists stories from Cloudinary (folder: `foto-stories/`); each item includes `isNew`
- DELETE /api/delete-photo - deletes by public_id (gallery or story), requires GALLERY_SECRET password
- PATCH /api/update-photo - updates caption/tags/takenAt, requires GALLERY_SECRET password

## Environment Variables

- CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
- CLOUDINARY_API_KEY - Cloudinary API key
- CLOUDINARY_API_SECRET - Cloudinary API secret
- ANTHROPIC_API_KEY - Claude API key for auto-tagging on upload (optional; auto-tagging no-ops if unset)
- GALLERY_SECRET - shared secret for upload (Bearer), delete, and update

## Planned Features (not yet built)

- ~~Sidecar JSON metadata (caption, tags)~~
- Stories "new" ring / unread UI callout (`isNew` already on API)
- Links section

## Key Files

- server/api/upload-photo.post.js - upload handler (Sharp WebP conversion + Cloudinary; destination routing)
- server/api/photos.get.js - list gallery photos from Cloudinary
- server/api/stories.get.js - list stories from Cloudinary
- server/utils/list-stories.js - story list + cache + `isNew`
- server/api/delete-photo.delete.js - delete photo/story from Cloudinary
- app/components/GalleryView.vue - gallery + stories strip orchestrator
- app/components/StoriesStrip.vue - horizontal story rings
- app/components/StoryViewer.vue - full-screen story viewer
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
- Stories strip sits above the photo grid; tap opens StoryViewer (progress bars, ~5s auto-advance)
