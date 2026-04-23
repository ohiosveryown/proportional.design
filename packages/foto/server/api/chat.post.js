import Anthropic from '@anthropic-ai/sdk'
import { listPhotos } from '../utils/list-photos.js'
import { SITE_INFO } from '../utils/site-info.js'

const SYSTEM_INTRO = `You help browse a personal photo gallery — mostly woodworking and furniture from Proportional Design, a small Atlanta studio. Reply in one or two sentences unless the user asks for more. Say "I'm not sure" when the manifest doesn't support a claim.

## Reply style

 - Refer to photos by caption or subject ("the walnut dovetail piece", "the one labeled 'Tiny dovetails'"). NEVER mention index numbers, filenames, or any internal ID — those are for tool calls only.
 - Do NOT narrate what you did or didn't do to the filter. The user sees the active filter chips above the input, so they already know. Only mention the filter if the user explicitly asks about it.
 - Don't apologize for or discuss filter state. If the user pushes back on something you said about filters, drop it and address their actual question.

## Two jobs

 - Answer questions about the collection.
 - Filter the grid, where a filter is a SET of short tags. Photos matching ANY active tag are shown (union).

## How filters change

The client tells you the CURRENT FILTER TAGS each turn. When you return \`filter.tags\`, you are replacing the entire set. Decide the new set like so:

 - Unqualified narrow ("show me chairs", "filter to walnut") → REPLACE: return just the new tag.
 - Additive language ("also cabinets", "cabinets too", "and chairs", "add walnut") → ADD: return the current tags PLUS the new one.
 - Intersection / refinement ("only the walnut ones", "just the WIP chairs") → REPLACE with a single combined tag (e.g. "walnut chairs") whose indices are the intersection.
 - Clear ("show all", "clear", "everything", "reset") → set \`clearFilter: true\` and leave \`filter\` null.
 - Pure question unrelated to filtering → leave \`filter\` null and \`clearFilter\` false (current filter stays as-is).

Each tag label is short and lowercase (e.g. "chairs", "walnut", "WIP cabinets"). The \`indices\` for each tag must be integer indices from the manifest below.

The manifest is the complete collection. Each line is:
<index> | <takenAt> | <caption> | <tags>
The index is for your tool call only — never say it to the user.`

const RESPOND_TOOL = {
  name: 'respond',
  description:
    'Reply to the user and optionally update the gallery filter tag set.',
  input_schema: {
    type: 'object',
    properties: {
      reply: {
        type: 'string',
        description: 'The short conversational reply shown to the user.',
      },
      filter: {
        type: ['object', 'null'],
        description:
          'The new complete filter tag set. Null when leaving the current filter unchanged.',
        properties: {
          tags: {
            type: 'array',
            description:
              "One entry per active filter tag. Photos shown are the UNION of all tags' indices.",
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string',
                  description: 'Short lowercase label (e.g. "chairs").',
                },
                indices: {
                  type: 'array',
                  items: { type: 'integer' },
                  description:
                    'Integer indices (0-based) from the manifest for the photos in this tag.',
                },
              },
              required: ['label', 'indices'],
            },
          },
        },
        required: ['tags'],
      },
      clearFilter: {
        type: 'boolean',
        description: 'True when the user asked to see everything again.',
      },
    },
    required: ['reply', 'clearFilter'],
  },
}

let client
function getClient() {
  if (!client) client = new Anthropic()
  return client
}

const PHOTO_CACHE_TTL_MS = 30_000
let photoCache = { at: 0, photos: null, inflight: null }

async function getCachedPhotos() {
  const now = Date.now()
  if (photoCache.photos && now - photoCache.at < PHOTO_CACHE_TTL_MS) {
    return photoCache.photos
  }
  if (photoCache.inflight) return photoCache.inflight
  photoCache.inflight = listPhotos()
    .then((photos) => {
      photoCache = { at: Date.now(), photos, inflight: null }
      return photos
    })
    .catch((e) => {
      photoCache.inflight = null
      throw e
    })
  return photoCache.inflight
}

function buildManifest(photos) {
  const latest = photos.reduce((max, p) => {
    const t = p.uploadedAt || ''
    return t > max ? t : max
  }, '')
  const header = `gallery-version: ${photos.length}-${latest}`
  const lines = photos.map((p, i) => {
    const takenAt = (p.takenAt || '').slice(0, 10)
    const caption = (p.caption || '').replace(/\s+/g, ' ').trim()
    const tags = (p.tags || []).join(',')
    return `${i} | ${takenAt} | ${caption} | ${tags}`
  })
  return [header, '', ...lines].join('\n')
}

function sanitizeHistory(messages) {
  if (!Array.isArray(messages)) return []
  return messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }))
}

export default defineEventHandler(async (event) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { success: false, error: 'Chat is not configured.' }
    }

    const body = await readBody(event)
    const history = sanitizeHistory(body?.messages)
    if (!history.length || history[history.length - 1].role !== 'user') {
      return { success: false, error: 'Missing user message.' }
    }
    const activeTags = Array.isArray(body?.activeTags)
      ? body.activeTags.filter((t) => typeof t === 'string')
      : []

    const photos = await getCachedPhotos()
    const manifest = buildManifest(photos)

    const currentLine = activeTags.length
      ? `CURRENT FILTER TAGS: ${activeTags.join(', ')}`
      : 'CURRENT FILTER TAGS: (none — showing all)'

    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: [
        {
          type: 'text',
          text: `${SYSTEM_INTRO}\n\n${SITE_INFO}\n\nGALLERY MANIFEST\n${manifest}`,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: currentLine,
        },
      ],
      tools: [RESPOND_TOOL],
      tool_choice: { type: 'tool', name: 'respond' },
      messages: history,
    })

    const toolUse = response.content.find((b) => b.type === 'tool_use')
    if (!toolUse) {
      return { success: false, error: 'No response from model.' }
    }

    const input = toolUse.input || {}
    const reply = typeof input.reply === 'string' ? input.reply : ''
    const clearFilter = input.clearFilter === true

    let filter = null
    if (input.filter && Array.isArray(input.filter.tags)) {
      const tags = input.filter.tags
        .map((t) => {
          if (!t || typeof t.label !== 'string') return null
          const label = t.label.trim()
          const indices = Array.isArray(t.indices) ? t.indices : []
          const filenames = []
          const seen = new Set()
          for (const raw of indices) {
            const i = Number(raw)
            if (!Number.isInteger(i) || i < 0 || i >= photos.length) continue
            const name = photos[i].filename
            if (seen.has(name)) continue
            seen.add(name)
            filenames.push(name)
          }
          if (!label || !filenames.length) return null
          return { label, filenames }
        })
        .filter(Boolean)
      if (tags.length) filter = { tags }
    }

    return { success: true, reply, filter, clearFilter }
  } catch (e) {
    console.error('chat endpoint error:', e)
    return { success: false, error: 'Something went wrong.' }
  }
})
