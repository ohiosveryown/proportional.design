import { listStories } from '../../utils/list-stories.js'

/**
 * Shortcut-friendly story picker payload.
 *
 * - `names`: plain text list for Choose from List
 * - `idsByName`: map name → storyId (empty string = New Story…)
 * - `choices`: same data as objects (Raycast / other clients)
 */
export default defineEventHandler(async () => {
  try {
    const stories = await listStories()
    const choices = [
      { name: 'New Story…', id: '' },
      ...stories.map((s) => ({
        name: s.name || 'Untitled story',
        id: s.id,
      })),
    ]

    // Deduplicate display names so the idsByName map stays 1:1.
    const seen = new Map()
    for (const c of choices) {
      let label = c.name
      if (seen.has(label)) {
        let n = 2
        while (seen.has(`${c.name} (${n})`)) n += 1
        label = `${c.name} (${n})`
      }
      seen.set(label, c.id)
      c.name = label
    }

    const names = [...seen.keys()]
    const idsByName = Object.fromEntries(seen)

    return {
      success: true,
      count: choices.length,
      names,
      idsByName,
      choices,
    }
  } catch (error) {
    console.error('Story choices error:', error)
    return {
      success: false,
      error: error.message,
      names: ['New Story…'],
      idsByName: { 'New Story…': '' },
      choices: [{ name: 'New Story…', id: '' }],
    }
  }
})
