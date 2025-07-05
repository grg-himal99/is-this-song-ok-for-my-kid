<template>
  <div class="container">
    <div class="content-box">
      <h1 class="title">Is This Song OK For My Kid?</h1>
      <p class="subtitle">Enter a YouTube URL to check if the song contains 18+ content</p>
      
      <YouTubeUrlInput 
        :is-loading="isLoading" 
        @check="checkSong" 
      />

      <LoadingSpinner :is-loading="isLoading">
        Analyzing song lyrics...
      </LoadingSpinner>

      <ErrorMessage :message="error" />

      <div v-if="result" class="result-container">
        <SongHeader 
          v-if="result.songInfo" 
          :song-info="result.songInfo" 
        />
        
        <div v-if="result.lyrics" class="lyrics-container">
          <AgeRating 
            :is-18-plus="result.is18Plus" 
            :detected-language="result.detectedLanguage" 
          />
          
          <div v-if="result.is18Plus" class="content-warnings">
            <h3>Content Warnings</h3>
            <div class="warning-categories">
              <ContentWarning 
                v-if="result.hasExplicitContent" 
                title="Explicit Language" 
                :words="result.foundExplicitWords"
                category="explicit"
              />
              
              <ContentWarning 
                v-if="result.hasSexualContent" 
                title="Sexual Content" 
                :words="result.foundSexualWords"
                category="sexual"
              />
              
              <ContentWarning 
                v-if="result.hasViolentThemes" 
                title="Violent Content" 
                :words="result.foundViolentWords"
                category="violent"
              />
              
              <ContentWarning 
                v-if="result.hasDrugReferences" 
                title="Drug/Alcohol References" 
                :words="result.foundDrugWords"
                category="drug"
              />
            </div>
          </div>
          
          <LyricsDisplay :lyrics="result.lyrics" />
        </div>
        
        <div v-if="result.lyricsNotFound" class="no-lyrics">
          <p>Sorry, we couldn't find lyrics for this song.</p>
          <p>Please check that the YouTube URL is correct and try again.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import YouTubeUrlInput from '~/components/YouTubeUrlInput.vue';
import LoadingSpinner from '~/components/LoadingSpinner.vue';
import ErrorMessage from '~/components/ErrorMessage.vue';
import SongHeader from '~/components/SongHeader.vue';
import AgeRating from '~/components/AgeRating.vue';
import ContentWarning from '~/components/ContentWarning.vue';
import LyricsDisplay from '~/components/LyricsDisplay.vue';
import { useYouTubeService } from '~/composables/useYouTubeService';
import { useLyricsAnalyzer } from '~/composables/useLyricsAnalyzer';

const youtubeUrl = ref('');
const isLoading = ref(false);
const result = ref(null);
const error = ref(null);

// Get services from composables
const { extractVideoId, getSongInfo, getLyrics } = useYouTubeService();
const { analyzeLyrics } = useLyricsAnalyzer();

const checkSong = async (url) => {
  youtubeUrl.value = url;
  error.value = null;
  isLoading.value = true;
  result.value = null;
  
  try {
    // Extract video ID from YouTube URL
    const videoId = extractVideoId(youtubeUrl.value);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }
    
    // Get song info from YouTube
    const songInfo = await getSongInfo(videoId);
    
    if (!songInfo.title) {
      throw new Error('Could not extract song information from this video.');
    }
    
    // Get lyrics using our API
    const lyrics = await getLyrics(songInfo.title, songInfo.artist);
    
    if (!lyrics) {
      result.value = {
        songInfo,
        lyrics: null,
        lyricsNotFound: true
      };
      return;
    }
    
    // Analyze lyrics for 18+ content
    const analysis = analyzeLyrics(lyrics);
    
    // Set the result
    result.value = {
      songInfo,
      lyrics,
      ...analysis
    };
  } catch (err) {
    console.error('Error:', err);
    error.value = err.message || 'An error occurred while processing your request.';
    result.value = null;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.content-box {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 40px;
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.title {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 32px;
}

.result-container {
  margin-top: 30px;
  text-align: left;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.content-warnings {
  margin-bottom: 30px;
}

.content-warnings h3 {
  margin-bottom: 15px;
  color: #1e40af;
}

.warning-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.no-lyrics {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  background-color: #fff;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  margin-top: 20px;
}

@media (max-width: 640px) {
  .content-box {
    padding: 24px;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .warning-categories {
    grid-template-columns: 1fr;
  }
}
</style>