import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You select tags for a personal photo gallery from an existing vocabulary. You will see an image and a list of allowed tags.

Rules:
- Choose 0 to 6 tags from the allowed list ONLY. Never invent new tags.
- Tag the photo's SUBJECT — what the photo is *of* — not incidental background, surroundings, or surfaces the subject happens to rest on. Workbenches, tables, floors, walls, shelves, and storage are SETTING, never subject — do not tag them even if they take up most of the frame. A porch swing being built on top of a workbench is a photo of the porch swing, not the workbench.
- Do NOT guess specifics from ambiguous visual cues. Wood species, material types, brand names, and exact locations are only valid tags when the photo unambiguously identifies them (e.g., a visible label). Wood color alone is not enough to identify the species.
- If a SUBJECT HINT is provided in the user message, treat it as the authoritative description of what the photo is of. Tags must be consistent with the hint; do not contradict it.
- Prefer fewer high-confidence tags over more uncertain ones. If nothing clearly fits, return an empty array.
- Match by meaning, not literal substring (a "sunset" tag fits a sunset photo even if other things are in frame).
- Precision matters more than recall. When in doubt, leave a tag out.

Respond with strict JSON only — no preamble, no markdown, no explanation:
{"tags": ["tag1", "tag2"]}

If nothing fits, respond with: {"tags": []}`

let client

function getClient() {
  if (!client) client = new Anthropic()
  return client
}

export async function autoTag(imageBuffer, allowedTags, caption = '') {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('autoTag: skipping (ANTHROPIC_API_KEY not set)')
    return []
  }
  if (!allowedTags || allowedTags.length === 0) {
    console.log('autoTag: skipping (empty vocabulary)')
    return []
  }

  const userText = caption
    ? `SUBJECT HINT: ${caption}\n\nAllowed tags: ${allowedTags.join(', ')}`
    : `Allowed tags: ${allowedTags.join(', ')}`

  try {
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/webp',
                data: imageBuffer.toString('base64'),
              },
            },
            {
              type: 'text',
              text: userText,
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock) return []

    let parsed
    try {
      parsed = JSON.parse(textBlock.text)
    } catch {
      console.error('autoTag: failed to parse JSON from model:', textBlock.text)
      return []
    }

    if (!Array.isArray(parsed?.tags)) return []

    const allowed = new Set(allowedTags)
    return parsed.tags.filter((t) => typeof t === 'string' && allowed.has(t))
  } catch (e) {
    console.error('autoTag: error calling Claude API:', e)
    return []
  }
}
