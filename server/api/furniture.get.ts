import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const FURNITURE_DATABASE_ID = process.env.NOTION_FURNITURE_DB_ID

export default defineEventHandler(async (event) => {
  // Cache for 5 minutes
  setHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  if (!FURNITURE_DATABASE_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Notion database ID not configured'
    })
  }

  try {
    const response = await notion.databases.query({
      database_id: FURNITURE_DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      },
      sorts: [
        {
          property: 'Date Created',
          direction: 'descending'
        }
      ]
    })

    const furniture = response.results.map((page: any) => {
      const properties = page.properties
      
      return {
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
    })

    return furniture
  } catch (error) {
    console.error('Error fetching furniture:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch furniture data'
    })
  }
})