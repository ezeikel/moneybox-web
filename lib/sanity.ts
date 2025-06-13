import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-19',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

export const getCategories = async () => {
  return client.fetch(`
    *[_type == "category"] {
      _id,
      name,
      "products": products[]-> {
        _id,
        name,
        "icon": icon.asset->url,
        description
      }
    }
  `)
} 