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
          <h3>Lyrics Not Found</h3>
          <p>We couldn't find lyrics for this song automatically.</p>
          
          <div class="suggestions">
            <h4>Try these tips:</h4>
            <ul>
              <li>Make sure the video title includes both artist and song name</li>
              <li>Use official music videos instead of covers or remixes</li>
              <li>Or find lyrics using the links below and paste them manually</li>
            </ul>
          </div>
          
          <div class="lyrics-sources">
            <h4>Find Lyrics Here:</h4>
            <div class="source-links">
              <a 
                :href="`https://genius.com/search?q=${encodeURIComponent((result.songInfo?.artist || '') + ' ' + (result.songInfo?.title || ''))}`" 
                target="_blank" 
                class="source-link genius"
              >
                🎵 Search on Genius
              </a>
              <a 
                :href="`https://www.azlyrics.com/search.php?q=${encodeURIComponent((result.songInfo?.artist || '') + ' ' + (result.songInfo?.title || ''))}`" 
                target="_blank" 
                class="source-link azlyrics"
              >
                📝 Search on AZLyrics
              </a>
              <a 
                :href="`https://www.google.com/search?q=${encodeURIComponent((result.songInfo?.artist || '') + ' ' + (result.songInfo?.title || '') + ' lyrics')}`" 
                target="_blank" 
                class="source-link google"
              >
                🔍 Google Search
              </a>
              <a 
                :href="`https://www.musixmatch.com/search/${encodeURIComponent((result.songInfo?.artist || '') + ' ' + (result.songInfo?.title || ''))}`" 
                target="_blank" 
                class="source-link musixmatch"
              >
                🎤 Search on Musixmatch
              </a>
            </div>
          </div>
          
          <div class="manual-input">
            <h4>Manual Lyrics Input</h4>
            <textarea 
              v-model="manualLyrics" 
              placeholder="Paste the song lyrics here and we'll analyze them for you..."
              rows="8"
              class="lyrics-textarea"
            ></textarea>
            <button 
              @click="analyzeManualLyrics" 
              :disabled="!manualLyrics.trim() || isAnalyzing"
              class="analyze-btn"
            >
              {{ isAnalyzing ? 'Analyzing...' : 'Analyze These Lyrics' }}
            </button>
          </div>
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
const manualLyrics = ref('');
const isAnalyzing = ref(false);

// Get services from composables
const { extractVideoId, getSongInfo, getLyrics } = useYouTubeService();
const { analyzeLyrics } = useLyricsAnalyzer();

const checkSong = async (url) => {
  youtubeUrl.value = url;
  error.value = null;
  isLoading.value = true;
  result.value = null;
  manualLyrics.value = '';
  
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

const analyzeManualLyrics = async () => {
  if (!manualLyrics.value.trim()) return;
  
  isAnalyzing.value = true;
  error.value = null;
  
  try {
    // Analyze the manually entered lyrics
    const analysis = analyzeLyrics(manualLyrics.value);
    
    // Update the result with manual lyrics
    result.value = {
      ...result.value,
      lyrics: manualLyrics.value,
      lyricsNotFound: false,
      ...analysis
    };
  } catch (err) {
    console.error('Error analyzing manual lyrics:', err);
    error.value = 'Error analyzing the lyrics. Please try again.';
  } finally {
    isAnalyzing.value = false;
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
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  margin-top: 20px;
}

.no-lyrics h3 {
  color: #374151;
  margin-bottom: 12px;
  text-align: center;
}

.suggestions {
  margin: 20px 0;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.suggestions h4 {
  color: #1e40af;
  margin-bottom: 8px;
  font-size: 1rem;
}

.suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #4b5563;
}

.suggestions li {
  margin-bottom: 4px;
}

.manual-input {
  margin-top: 24px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.manual-input h4 {
  color: #374151;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.lyrics-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
}

.lyrics-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.analyze-btn {
  margin-top: 12px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.analyze-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.lyrics-sources {
  margin-top: 20px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #0ea5e9;
}

.lyrics-sources h4 {
  color: #0c4a6e;
  margin-bottom: 12px;
  font-size: 1rem;
}

.source-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.source-link {
  display: inline-block;
  padding: 8px 12px;
  background-color: white;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;
}

.source-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.source-link.genius:hover {
  border-color: #ffff00;
  background-color: #fffbeb;
}

.source-link.azlyrics:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.source-link.google:hover {
  border-color: #10b981;
  background-color: #ecfdf5;
}

.source-link.musixmatch:hover {
  border-color: #f59e0b;
  background-color: #fef3c7;
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
  
  .manual-input {
    padding: 16px;
  }
  
  .suggestions {
    padding: 12px;
  }
  
  .source-links {
    grid-template-columns: 1fr;
  }
}
</style>