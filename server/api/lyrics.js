/**
 * Server API endpoint to fetch song lyrics
 * Calls external lyrics API (lyrics.ovh) with artist and title parameters
 */
export default defineEventHandler(async (event) => {
  // Extract query parameters from the request
  const query = getQuery(event);
  const { artist, title } = query;

  // Validate required parameters
  if (!artist || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Artist and title are required',
    });
  }

  try {
    // Get lyrics API base URL from environment variables
    const apiBaseUrl = process.env.LYRICS_API_BASE_URL || 'https://api.lyrics.ovh/v1';
    
    // Make request to external lyrics API
    // URL format: https://api.lyrics.ovh/v1/ARTIST/TITLE
    const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    // Check if the API request was successful
    if (response.ok) {
      const data = await response.json();
      // Verify that lyrics data exists and is not empty
      if (data.lyrics && data.lyrics.length > 0) {
        return { lyrics: data.lyrics };
      }
    }
    
    // If no lyrics found, throw 404 error
    throw createError({
      statusCode: 404,
      statusMessage: 'Lyrics not found',
    });
  } catch (error) {
    // Handle any errors that occurred during the API call
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch lyrics',
    });
  }
});