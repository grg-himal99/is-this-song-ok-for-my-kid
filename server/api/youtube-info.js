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
    
    // Try to extract artist from title (common format: "Artist - Song Title")
    let artist = null;
    if (title.includes(' - ')) {
      artist = title.split(' - ')[0].trim();
    }
    
    // Clean up the title if we found an artist
    const cleanTitle = artist ? title.split(' - ')[1]?.trim() || title : title;
    
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