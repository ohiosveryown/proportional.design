# Raycast ↔ Personal App Extension Pattern

Use this doc when scaffolding a Raycast extension that talks to your own app/API (same shape as this Links extension). Point Cursor at this file in another repo, or copy it into that project as `cursor.md` / `.cursor/rules/…`.

## What you are building

A small Raycast extension that:

1. Reads **API Base URL** + **Shared Secret** from extension preferences
2. Calls your app’s HTTP API with `Authorization: Bearer <secret>`
3. Exposes a few commands — typically a fast “capture” command (`no-view`) plus optional list / picker UIs (`view`)

Keep the extension thin: Raycast owns UX (toasts, grids, forms); your app owns storage and domain logic.

## Scaffold

```
my-extension/
  package.json          # Raycast manifest (commands + preferences)
  tsconfig.json
  assets/command-icon.png
  src/
    capture.ts          # no-view command (toast-only)
    recent.tsx          # view command (list/grid)
    save-file.tsx       # optional form / Finder-aware command
```

### Bootstrap

```bash
npm create raycast-extension@latest
# or reuse this repo’s package.json shape and npm install
```

Scripts to keep:

```json
{
  "scripts": {
    "build": "ray build -e dist",
    "dev": "ray develop",
    "lint": "ray lint",
    "fix-lint": "ray lint --fix"
  }
}
```

Deps: `@raycast/api`, `@raycast/utils`. Dev: `@raycast/eslint-config`, TypeScript, React types.

### `tsconfig.json` (minimal)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "include": ["src/**/*"],
  "compilerOptions": {
    "lib": ["ES2023"],
    "module": "ESNext",
    "target": "ES2022",
    "strict": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

`raycast-env.d.ts` is auto-generated from `package.json` — do not edit by hand.

## Manifest (`package.json`)

Raycast treats `package.json` as the extension manifest. Key pieces:

### Commands

| Mode | File | When to use |
|------|------|-------------|
| `no-view` | `src/<name>.ts` | Fire-and-forget (save current tab, quick action). Toast feedback only. |
| `view` | `src/<name>.tsx` | Needs UI: Grid, List, Form, Detail. |

Command `name` must match the source filename (`save-tab` → `src/save-tab.ts`).

### Preferences (shared across commands)

Always define these two for this pattern:

```json
"preferences": [
  {
    "name": "apiBaseUrl",
    "title": "API Base URL",
    "description": "Base URL of your app",
    "type": "textfield",
    "default": "https://example.com",
    "required": true
  },
  {
    "name": "sharedSecret",
    "title": "Shared Secret",
    "description": "Bearer token. Must match the server env var.",
    "type": "password",
    "required": true
  }
]
```

Read them with:

```ts
type Prefs = { apiBaseUrl: string; sharedSecret: string };
const { apiBaseUrl, sharedSecret } = getPreferenceValues<Prefs>();
const base = apiBaseUrl.replace(/\/$/, "");
```

## API contract your app should expose

Adapt paths/payloads to the target app, but keep this shape:

### Write (authenticated)

```
POST {base}/api/collect
Authorization: Bearer <sharedSecret>
```

- **JSON body** (links / metadata):
  ```json
  { "type": "link", "url": "https://…" }
  ```
  Headers: `Content-Type: application/json`

- **Multipart** (files / images):
  ```
  FormData: type=image, image=<file blob>
  ```
  Do **not** set `Content-Type` manually — let `fetch` set the multipart boundary.

Responses:

| Status | Extension behavior |
|--------|--------------------|
| `2xx` | Success toast |
| `401` | Failure toast + “Open Preferences” action |
| other | Failure toast with status + body text |
| network error | Failure toast asking if the app is running at `base` |

### Read (list recent)

```
GET {base}/api/items
→ { "items": [ { id, title, type, url, description, image, tags, capturedAt, domain } ] }
```

Auth on read is optional; this extension’s `recent` command fetches without a Bearer token. Prefer auth if the collection is private.

## Command patterns to copy

### 1. `no-view` capture (toast lifecycle)

```ts
const toast = await showToast({ style: Toast.Style.Animated, title: "Saving…" });
try {
  // gather input → POST
  toast.style = Toast.Style.Success;
  toast.title = "Saved";
} catch {
  toast.style = Toast.Style.Failure;
  toast.title = "Couldn't reach app";
  toast.message = `Is it running at ${base}?`;
}
```

For browser tabs, use `BrowserExtension.getTabs()` and pick the active tab. Require the Raycast browser extension; surface a clear error if missing.

On `401`, attach:

```ts
toast.primaryAction = {
  title: "Open Preferences",
  onAction: () => openExtensionPreferences(),
};
```

### 2. `view` recent grid/list

Use `@raycast/utils` `usePromise` for fetch + loading/error:

```tsx
const { data, isLoading } = usePromise(
  async () => {
    const res = await fetch(`${base}/api/items`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { items: Item[] };
    return json.items.slice(0, 5);
  },
  [],
  {
    onError(err) {
      showToast({
        style: Toast.Style.Failure,
        title: "Couldn't fetch items",
        message: err instanceof Error ? err.message : String(err),
      });
    },
  },
);
```

Prefer `Grid` when items have thumbnails; otherwise `List`. Always offer:

- Open source URL (if present)
- Open item in your app (`${base}/${id}`)
- Copy URL

### 3. Finder-aware form command

1. On mount, try `getSelectedFinderItems()`.
2. If a valid file is selected → upload immediately → `popToRoot()`.
3. Else show a `Form` with `Form.FilePicker`.
4. Guard with a `useRef` so the Finder check runs once.

Validate MIME/extension before upload; reject with a toast.

## Conventions

- **Strip trailing slash** on `apiBaseUrl` before joining paths.
- **Never hardcode secrets** — preferences only (`type: "password"`).
- **Reuse toast mutation** (Animated → Success/Failure) instead of stacking toasts.
- **One concern per command file**; share helpers only when a second command needs them.
- **Type prefs locally** (`type Prefs = …`) even though `raycast-env.d.ts` exists — keeps commands portable.
- Match server secret name in preference description (e.g. `NUXT_COLLECT_SHARED_SECRET`) so setup is obvious.

## Porting checklist (new codebase)

1. [ ] Create Raycast extension (`package.json` commands + preferences).
2. [ ] Point `apiBaseUrl` default at the new app; rename preference copy to match that product.
3. [ ] Confirm server accepts Bearer shared secret on write endpoints.
4. [ ] Implement or adapt `/api/collect` (JSON and/or multipart) and `/api/items` (or equivalents).
5. [ ] Add a `no-view` capture command for the primary input (tab, selection, clipboard, etc.).
6. [ ] Optionally add a recent `view` command and/or file upload command.
7. [ ] Run `npm run dev`, set preferences in Raycast, verify 401 → Open Preferences and happy-path save.
8. [ ] Drop this `cursor.md` into the new repo (or `@`-reference it) so Cursor follows the same pattern.

## Prompt snippet for another repo

> Follow `cursor.md`. Scaffold a Raycast extension that posts to this app’s collect API using preferences `apiBaseUrl` + `sharedSecret`, with a no-view save command and a recent items grid. Mirror the toast/401/Finder patterns described there; adapt endpoints and payloads to this codebase’s API.
