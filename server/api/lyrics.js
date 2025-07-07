export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { artist, title } = query;

  if (!artist || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Artist and title are required',
    });
  }

  try {
    // Try lyrics.ovh API
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.lyrics && data.lyrics.length > 0) {
        return { lyrics: data.lyrics };
      }
    }
    
    throw createError({
      statusCode: 404,
      statusMessage: 'Lyrics not found',
    });
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch lyrics',
    });
  }
});