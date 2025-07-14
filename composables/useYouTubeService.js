/**
 * Composable for YouTube and lyrics service functions
 * Handles YouTube URL parsing, video info extraction, and lyrics fetching
 */
export const useYouTubeService = () => {
  /**
   * Extract video ID from YouTube URL
   * Supports various YouTube URL formats (youtube.com, youtu.be, etc.)
   * @param {string} url - YouTube video URL
   * @returns {string|null} - 11-character video ID or null if invalid
   */
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
  
  /**
   * Clean up song titles by removing common video-related words and formatting
   * Improves lyrics search accuracy by removing noise from video titles
   * @param {string} title - Original song title
   * @returns {string} - Cleaned title
   */
  const cleanSongTitle = (title) => {
    return title
      .replace(/\(.*?\)/g, '') // Remove content in parentheses (Official Video, etc.)
      .replace(/\[.*?\]/g, '') // Remove content in square brackets
      .replace(/official|video|music|lyric|lyrics|hd|4k|mv|clip/gi, '') // Remove common video keywords
      .replace(/ft\.|feat\.|featuring/gi, '') // Remove featuring indicators
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace
  };

  /**
   * Extract song information from YouTube video
   * Calls server API to get video metadata and cleans up title/artist
   * @param {string} videoId - YouTube video ID
   * @returns {Object} - Song info object with title, artist, thumbnail
   */
  const getSongInfo = async (videoId) => {
    try {
      // Call our server API endpoint to get YouTube video info
      const response = await fetch(`/api/youtube-info?videoId=${videoId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }
      
      const data = await response.json();
      
      // Clean up the title and artist for better lyrics search accuracy
      let cleanTitle = data.title;
      let cleanArtist = data.artist;
      
      if (cleanTitle) {
        cleanTitle = cleanSongTitle(cleanTitle);
      }
      if (cleanArtist) {
        cleanArtist = cleanSongTitle(cleanArtist);
      }
      
      return {
        title: cleanTitle || data.title, // Use cleaned title, fallback to original
        artist: cleanArtist || data.artist, // Use cleaned artist, fallback to original
        originalTitle: data.title, // Keep original title for reference
        thumbnailUrl: data.thumbnailUrl // Video thumbnail image
      };
    } catch (err) {
      console.error('Error fetching YouTube info:', err);
      // Fallback response when API call fails
      return {
        title: `YouTube Video (${videoId})`,
        artist: null
      };
    }
  };

  /**
   * Fetch song lyrics using artist and title
   * Calls server API which then queries external lyrics service
   * @param {string} songTitle - Song title
   * @param {string} artist - Artist name
   * @returns {string|null} - Lyrics text or null if not found
   */
  const getLyrics = async (songTitle, artist) => {
    try {
      // Both artist and title are required for lyrics search
      if (!artist) {
        return null;
      }
      
      // Call our server API endpoint with URL-encoded parameters
      const response = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(songTitle)}`);
      
      // Return null if request failed (lyrics not found)
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.lyrics; // Return the lyrics text
    } catch (err) {
      console.error('Error fetching lyrics:', err);
      return null; // Return null on any error
    }
  };

  // Return all service functions
  return {
    extractVideoId,
    getSongInfo,
    getLyrics
  };
};