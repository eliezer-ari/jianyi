import { createClient } from 'contentful';

export const createContentClient = () => {
  console.log('createClient:', createClient);
  console.log('Space ID:', process.env.REACT_APP_CONTENTFUL_SPACE_ID);
  console.log('Access Token:', process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN);

  return createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  })
}
const client = createContentClient()

export const getEntriesByType = async (type) => {
  const response = await client.getEntries({
    content_type: type,
  })
  return response.items
}

export const getBio = async () => {
  const results = await client.getEntry('7ovDr8zDNCqq96z4N3w3WP')
  return results
}

export const getPress = async () => {
  const results = await client.getEntry('U3Ln8KBptuuONdgAkTyhE')

  console.log('results:', results);
  return results
}

export const getProjects = async () => {
    const results = await client.getEntries({
        content_type: 'project'
      })
  return results
}
// export const getEntryBySlug = async (slug, type) => {
//   const queryOptions = {
//     content_type: type,
//     'fields.slug[match]': slug,
//   }
//   const queryResult = await client.getEntries(queryOptions)
//   return queryResult.items[0]
// }