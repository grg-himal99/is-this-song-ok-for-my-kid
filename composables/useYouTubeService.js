export const useYouTubeService = () => {
  // Function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Function to extract song title and artist from YouTube
  const getSongInfo = async (videoId) => {
    try {
      // Using our server API endpoint
      const response = await fetch(`/api/youtube-info?videoId=${videoId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }
      
      const data = await response.json();
      return {
        title: data.title,
        artist: data.artist,
        thumbnailUrl: data.thumbnailUrl
      };
    } catch (err) {
      console.error('Error fetching YouTube info:', err);
      // Fallback to just using the video ID
      return {
        title: `YouTube Video (${videoId})`,
        artist: null
      };
    }
  };

  // Function to search for lyrics using our API
  const getLyrics = async (songTitle, artist) => {
    try {
      if (!artist) {
        return null; // We need both title and artist for our API
      }
      
      // Using our server API endpoint
      const response = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(songTitle)}`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.lyrics;
    } catch (err) {
      console.error('Error fetching lyrics:', err);
      return null;
    }
  };

  return {
    extractVideoId,
    getSongInfo,
    getLyrics
  };
};