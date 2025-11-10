import { createClient } from 'contentful';

export const createContentClient = () => {
  const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    const error = new Error(
      'Contentful configuration is missing. ' +
      'Please set REACT_APP_CONTENTFUL_SPACE_ID and REACT_APP_CONTENTFUL_ACCESS_TOKEN environment variables. ' +
      `Space ID: ${spaceId ? '✓' : '✗ Missing'}, Access Token: ${accessToken ? '✓' : '✗ Missing'}`
    );
    console.error(error.message);
    throw error;
  }

  return createClient({
    space: spaceId,
    accessToken: accessToken,
  });
}

// Lazy initialization - only create client when a function is called
let client = null;

const getClient = () => {
  if (!client) {
    client = createContentClient();
  }
  return client;
}

export const getEntriesByType = async (type) => {
  const response = await getClient().getEntries({
    content_type: type,
  })
  return response.items
}

export const getBio = async () => {
  const results = await getClient().getEntry('7ovDr8zDNCqq96z4N3w3WP')
  return results
}

export const getPress = async () => {
  const results = await getClient().getEntry('U3Ln8KBptuuONdgAkTyhE')
  console.log('results:', results);
  return results
}

export const getProjects = async () => {
    const results = await getClient().getEntries({
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