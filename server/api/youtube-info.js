export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const videoId = query.videoId;

  if (!videoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Video ID is required',
    });
  }

  try {
    // In a production app, you would use the YouTube Data API
    // For now, we'll make a simple fetch to get the video title
    const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video information');
    }
    
    const data = await response.json();
    
    // Extract title and try to parse artist
    const title = data.title;
    
    // Try to extract artist from title (multiple formats)
    let artist = null;
    let cleanTitle = title;
    
    if (title.includes(' - ')) {
      // Format: "Artist - Song Title"
      artist = title.split(' - ')[0].trim();
      cleanTitle = title.split(' - ')[1]?.trim() || title;
    } else if (title.includes(' – ')) {
      // Format: "Artist – Song Title" (em dash)
      artist = title.split(' – ')[0].trim();
      cleanTitle = title.split(' – ')[1]?.trim() || title;
    } else if (title.includes(' by ')) {
      // Format: "Song Title by Artist"
      const parts = title.split(' by ');
      if (parts.length === 2) {
        cleanTitle = parts[0].trim();
        artist = parts[1].trim();
      }
    }
    
    // Remove common suffixes from title
    cleanTitle = cleanTitle.replace(/\s*\((Official|Music|Lyric)\s*(Video|Audio|MV)?.*\)$/i, '').trim();
    cleanTitle = cleanTitle.replace(/\s*\[(Official|Music|Lyric)\s*(Video|Audio|MV)?.*\]$/i, '').trim();
    
    return {
      title: cleanTitle,
      artist: artist,
      originalTitle: title,
      thumbnailUrl: data.thumbnail_url
    };
  } catch (error) {
    console.error('Error fetching YouTube info:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch video information',
    });
  }
});