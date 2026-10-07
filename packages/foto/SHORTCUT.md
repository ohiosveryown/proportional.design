# Foto — Apple Shortcut (“Fotos”)

Hand-off doc for the Share Sheet shortcut that uploads to `fotos.proportional.design` (or a Vercel preview host). Backend support for destinations + story picking is already in the foto package; the Shortcut app still needs the story-picker steps wired if not finished yet.

---

## What the shortcut does today

**Name:** Fotos (Share Sheet)  
**Trigger:** Share one or more photos → Fotos

### Current flow (as of stories work)

1. Receive **Shortcut Input** (image(s)).
2. Optionally format / encode dates for `takenAt` (if present in the shortcut).
3. **Resize** image(s) (historically ~1000–2000px wide, auto height).
4. **Repeat with each** resized image.
5. **Choose from Menu:** Gallery / Story / Both  
   - Each branch sets variable `Destination` to `gallery` | `story` | `both` via Text + Set Variable.
6. **Ask for Text** — Caption? (optional).
7. URL-encode caption (if used).
8. **Ask for Text** — Tags (comma separated) (optional; mainly for gallery).
9. **Get Contents of URL** — `POST` raw image bytes to upload API (see below).

### Upload request (already working)

| Piece | Value |
| ----- | ----- |
| Method | `POST` |
| URL base | `https://fotos.proportional.design/api/upload-photo` (or preview host) |
| Query | `filename`, `destination`, optional `caption`, `tags`, `takenAt` |
| Headers | `Authorization: Bearer <GALLERY_SECRET>` (required) |
| Body | File (resized image / Repeat Item) |
| Content-Type | image MIME (e.g. `image/jpeg`) |

**Important:** Production only deploys from `main` unless preview deployments are enabled. A branch push does not update an old `*.vercel.app` URL. Point the shortcut at a host that actually has the stories code (`GET /api/stories` and `/api/stories/choices` must not 404).

---

## Backend contract (already implemented)

### `POST /api/upload-photo`

- Auth: `Authorization: Bearer <GALLERY_SECRET>`
- Body: raw image bytes
- Query params:

| Param | Required | Notes |
| ----- | -------- | ----- |
| `filename` | yes (practically) | e.g. from Repeat Item name |
| `destination` | no | `gallery` (default) \| `story` \| `both` |
| `caption` | no | |
| `tags` | no | comma-separated; used for gallery / both |
| `takenAt` | no | ISO fallback if EXIF missing |
| `storyId` | no | only for `story` / `both` — append to existing story |
| `storyName` | no | only for `story` / `both` — match by name or create new |

**Destination behavior**

| `destination` | Cloudinary | Auto-tag |
| ------------- | ---------- | -------- |
| `gallery` | `foto/` | yes |
| `story` | `foto-stories/` | no |
| `both` | both folders (two `public_id`s) | gallery copy only |

**Story targeting** (`story` / `both` only)

| Input | Result |
| ----- | ------ |
| `storyId` set | Append to that story; name from existing group |
| `storyName` only | Case-insensitive name match, or create new group |
| neither | New `Untitled story` with a fresh id |

Each story asset stores Cloudinary context: `storyId`, `storyName`, plus optional `caption` / `takenAt`.

### `GET /api/stories/choices` (for pickers)

No auth. Lightweight JSON for Shortcuts / Raycast:

```json
{
  "success": true,
  "choices": [
    { "name": "New Story…", "id": "" },
    { "name": "Shop WIP", "id": "shop-wip" }
  ]
}
```

- Empty `id` means **create a new story** (then ask the user for a name → send as `storyName` only).
- Non-empty `id` → send as `storyId` (and optionally `storyName`).

### `GET /api/stories`

Full grouped list (`id`, `name`, `items[]`, `isNew`, …). Heavier; prefer `/api/stories/choices` inside Shortcuts.

---

## What still needs to be added to the Shortcut (option C)

Goal: after choosing **Story** or **Both**, let the user pick an existing story or start a new one. **Skip this entire block when Destination is Gallery.**

### Step A — Fetch choices (Story / Both branches only)

1. **Get Contents of URL**
   - URL: `https://<host>/api/stories/choices`
   - Method: **GET**
   - No Authorization header

### Step B — Pull the list

2. **Get Dictionary from Input** (Contents of URL), if Shortcuts didn’t already parse JSON.
3. **Get Dictionary Value** → key `choices`  
   Result: list of dictionaries `{ name, id }`.

### Step C — User picks

4. **Choose from List** — list = `choices`  
   - If the UI shows raw dictionaries, configure it to display the **`name`** key when available.
   - List includes existing stories plus **New Story…**.

### Step D — Capture id + name

5. From the **Chosen Item**:
   - **Get Dictionary Value** `id` → **Set Variable** `StoryId`
   - **Get Dictionary Value** `name` → **Set Variable** `StoryName`

### Step E — New story name

6. **If** `StoryId` **has any value** → do nothing (existing story).  
   **Otherwise** (New Story…):
   - **Ask for Text** — “Story name?”
   - **Set Variable** `StoryName` to the answer
   - Leave `StoryId` empty

### Step F — Wire into the existing POST URL

7. On **Get Contents of URL** (upload), extend the query string:

```
https://<host>/api/upload-photo?filename=[Name]&destination=[Destination]&caption=[EncodedCaption]&tags=[EncodedTags]&storyId=[StoryId]&storyName=[StoryName]
```

- When Destination is **Gallery**, omit `storyId` and `storyName` (or leave them blank).
- Keep Method **POST**, Headers **Authorization: Bearer …**, Request Body **File**.

URL-encode `storyName` if it may contain spaces (Shortcuts **URL Encode** action, or rely on URL field encoding).

---

## Suggested Shortcut structure (after option C)

```
Share Sheet image(s)
  → Resize
  → Repeat each image
      → Choose from Menu: Gallery | Story | Both
          → Set Destination = gallery | story | both
      → [If Story or Both]
          → GET /api/stories/choices
          → Choose from List (choices)
          → Set StoryId / StoryName
          → If StoryId empty → Ask “Story name?” → StoryName
      → Ask Caption / Tags (existing)
      → POST /api/upload-photo?destination=…&storyId=…&storyName=…
```

Mirror the Story/Both picker in **both** menu branches (or factor with a common group of actions after the menu if you restructure).

---

## Related app behavior (context for other chats)

- Stories UI: strip above the gallery; multi-image stories; cube transition between rings; hold to pause; swipe between stories.
- Long-press story ring → delete entire story (`DELETE /api/delete-story`) — only removes `foto-stories/` assets, not gallery `foto/` copies.
- In story viewer: **Remove** or **⇧?** → remove current slide from story (deletes that `foto-stories/` file only).
- Edit gallery photo → optional “Add to story” (`POST /api/add-to-story`) copies into an existing story without removing the gallery original.
- Raycast upload already supports destination + story picker via `/api/stories/choices`.

---

## Checklist for the next chat

- [ ] Confirm shortcut host has stories deploy (`/api/stories/choices` returns JSON, not 404)
- [ ] Add GET choices + Choose from List only under Story / Both
- [ ] Set `StoryId` / `StoryName` variables
- [ ] Ask for name when `StoryId` is empty
- [ ] Append `storyId` + `storyName` to upload URL for Story / Both
- [ ] Smoke test: Gallery (unchanged), New Story…, append to existing story, Both

---

## Key code paths

| Path | Role |
| ---- | ---- |
| `packages/foto/server/api/upload-photo.post.js` | Upload + `destination` + `storyId` / `storyName` |
| `packages/foto/server/api/stories/choices.get.js` | Shortcut/Raycast picker list |
| `packages/foto/server/utils/list-stories.js` | Grouped story list + cache |
| `packages/foto/server/utils/story-id.js` | Slug id from new story name |
| `packages/foto-raycast/src/upload-photo.tsx` | Desktop upload UI with story picker |
| `packages/foto/CLAUDE.md` | Broader foto project notes |
