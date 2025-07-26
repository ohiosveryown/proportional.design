import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const FURNITURE_DATABASE_ID = process.env.NOTION_FURNITURE_DB_ID

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!FURNITURE_DATABASE_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Notion database ID not configured'
    })
  }

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  try {
    // First, find the page by slug
    const response = await notion.databases.query({
      database_id: FURNITURE_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      }
    })

    if (response.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Furniture piece not found'
      })
    }

    const page: any = response.results[0]
    const currentLikes = page.properties.Likes?.number || 0
    const newLikes = currentLikes + 1

    // Update the likes count
    await notion.pages.update({
      page_id: page.id,
      properties: {
        Likes: {
          number: newLikes
        }
      }
    })

    return { 
      success: true, 
      likes: newLikes 
    }

  } catch (error) {
    console.error('Error updating likes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update likes'
    })
  }
})