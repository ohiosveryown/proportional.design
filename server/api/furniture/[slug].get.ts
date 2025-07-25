import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const FURNITURE_DATABASE_ID = process.env.NOTION_FURNITURE_DB_ID

export default defineEventHandler(async (event) => {
  // Cache for 10 minutes (individual pieces change less frequently)
  setHeader(event, 'Cache-Control', 's-maxage=600, stale-while-revalidate=1200')
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
    const properties = page.properties

    const furniture = {
      id: page.id,
      title: properties.Name?.title?.[0]?.text?.content || 'Untitled',
      description: properties.Description?.rich_text?.[0]?.text?.content || '',
      slug: properties.Slug?.rich_text?.[0]?.text?.content || page.id,
      materials: properties.Materials?.multi_select?.map((m: any) => m.name) || [],
      category: properties.Category?.select?.name || 'Uncategorized',
      images: properties.Images?.files?.map((file: any) => {
        if (file.type === 'file') {
          return file.file.url
        } else if (file.type === 'external') {
          return file.external.url
        }
        return null
      }).filter(Boolean) || [],
      dateCreated: properties['Date Created']?.date?.start || page.created_time,
      lastEdited: page.last_edited_time
    }

    return furniture
  } catch (error) {
    console.error('Error fetching furniture piece:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch furniture piece'
    })
  }
})